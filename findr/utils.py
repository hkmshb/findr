import os
import re
import json
import itertools
import requests



# RE PATTERNS
re_acctno_slash   = re.compile("^\d{2}\/\d{2}\/\d{2}\/\d{4}-01$")
re_acctno_noslash = re.compile("^\d{10}-01$")
re_meterno        = re.compile("^(\w\d{6,14}|\d{7,14})$")


def is_valid_account_no(value):
    if value:
        matched = re_acctno_slash.match(value) or re_acctno_noslash.match(value) 
        return matched != None
    return False


def is_valid_entry(value):
    if value and not value.isalpha():
        if is_valid_account_no(value):
            return True
        return re_meterno.match(value) != None
    return False


def get_api_client(registry):
    config = {key: registry.settings['api.kedco.%s' % key]
                for key in ['host', 'path', 'merchant', 'token']}
    return ApiClient(**config)


class ApiClient(object):
    def __init__(self, **config):
        valid_keys = ('host', 'path', 'merchant', 'token')
        for key in valid_keys:
            if key not in config or not config[key]:
                raise ValueError('%s is required' % key)
        self.config = config
    
    def _get_url(self, lookup_key, reftype='meter', postpaid=False):
        url_format = (
            '{host}{path}/{merchant}/{lookup_key}/{token};'
            'referencetype={reftype}?postpaid={postpaid}')
        
        return url_format.format(
            lookup_key=lookup_key, postpaid=postpaid,
            reftype=reftype, **self.config
        )
        
    def get(self, lookup_key):
        exception, reftypes, flags = (None, [], (True, False))
        if lookup_key.endswith('-01') or lookup_key.endswith('01'):
            reftypes.extend(['accountnumber', 'meter'])
            lookup_key = lookup_key.replace('-', '')
        else:
            reftypes.extend(['meter', 'accountnumber'])

        for reftype, flag in itertools.product(reftypes, flags):
            try:
                url = self._get_url(lookup_key, reftype, flag)
                response = requests.get(url)
                if response.status_code == 200:
                    return response.json()
            except Exception as ex:
                exception = ex 
        return {'error': str(exception or "Account not found")}

