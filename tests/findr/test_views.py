import pytest
from pyramid import testing



class DummyApiClient(object):
    def get(self, lookup_key):
        return {'content': 'empty'}

class DummyRegistry(object):
    def __init__(self, settings):
        self.settings = settings


class TestViews(object):

    def _make_request(self, lookup_key, settings=None):
        if not settings:
            settings = {
                'api.kedco.host': 'host', 
                'api.kedco.path': 'path', 
                'api.kedco.merchant': 'merchant', 
                'api.kedco.token': 'token'
            }
        
        request = testing.DummyRequest()
        request.matchdict = {'key': lookup_key}
        request.registry = DummyRegistry(settings)
        return request

    def test_home_returns_empty_dict(self):
        from findr.views import home
        resp = home(testing.DummyRequest())
        assert resp == {}
    
    def test_account_lookup_fails_if_key_not_provided(self):
        from findr.views import account_lookup
        with pytest.raises(Exception):
            resp = home(testing.DummyRequest())
    
    def test_account_lookup_uses_cached_api_client_if_available(self):
        from findr import views
        
        views.CACHE['api_client'] = DummyApiClient()
        request = self._make_request(lookup_key='10232136')

        resp = views.account_lookup(request)
        assert resp['content'] == 'empty'
