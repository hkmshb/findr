import os
import re
import json
import requests
from datetime import datetime
from pyramid.view import view_config
from . import utils


CACHE = {}


@view_config(route_name="home", renderer="index.html")
def home(request):
    return {
        'year': datetime.today().year,
        'version': request.registry.settings['findr.version']
    }
    

@view_config(route_name="account_lookup", renderer="json")
def account_lookup(request):
    lookup_key = request.matchdict['key']
    if not utils.is_valid_entry(lookup_key):
        raise Exception('Invalid entry provided: account or meter number required.')
    
    api_client = CACHE.get('api_client', utils.get_api_client(request.registry))
    response = api_client.get(lookup_key)
    return response

