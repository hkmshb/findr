import pytest
from findr import utils


@pytest.fixture()
def api_config():
    return { 
        'host': 'http://localhost:9889', 'path': '/apiservice',
        'merchant': 105, 'token': 778 
    }


class TestAccountValidation(object):

    @pytest.mark.parametrize("value", ["", "  ", None])
    def test_fails_for_empty_or_null_value(self, value):
        assert utils.is_valid_account_no(value) == False

    @pytest.mark.parametrize("value", ["a", "acct", "account", "account number"])
    def test_fails_for_all_alphabet_characters(self, value):
        assert utils.is_valid_account_no(value) == False

    @pytest.mark.parametrize("value", ["AA/BB/CC/DDDD-XX"])
    def test_fails_for_alphasym_characters(self, value):
        assert utils.is_valid_account_no(value) == False
    
    @pytest.mark.parametrize("value", [
        "3/322/11/0001-01", "332/2/11/0001-01", "33/22/1/10001-01", "33/22/110/001-01",
        "33/22/11/0001-02", "32/22/11/0001", "3322/11/0001-01"])
    def test_fails_for_invalid_slashed_account_format(self, value):
        assert utils.is_valid_account_no(value) == False
    
    @pytest.mark.parametrize("value", ["32/22/11/0001-01", "92/88/77/4443-01"])
    def test_passes_for_valid_slashed_account_format(self, value):
        assert utils.is_valid_account_no(value) == True
    
    @pytest.mark.parametrize("value", [
        "3322110001", "3322110001-0", "33221100001-01", "322110001-01", "3322110001-02"])
    def test_fails_for_invaild_nonslashed_account_format(self, value):
        assert utils.is_valid_account_no(value) == False


class TestEntryValidation(object):

    @pytest.mark.parametrize("value", ["", "  ", None])
    def test_fails_for_empty_or_null(self, value):
        assert utils.is_valid_entry(value) == False

    @pytest.mark.parametrize("value", [
        "33/22/11/0001", "3322/11/0001-01", "3/322/11/0001-01", "33/22/11/0001-02"])
    def test_fails_for_invalid_slashed_account_number_format(self, value):
        assert utils.is_valid_entry(value) == False

    @pytest.mark.parametrize("value", ["3322110001-01", "33/22/11/0001-01"])
    def test_passes_for_valid_account_number_format(self, value):
        assert utils.is_valid_entry(value) == True
    
    @pytest.mark.parametrize("value", ["3322110001", "322110001"])
    def test_passes_for_invalid_non_slashed_account_number_treated_as_meter_number(self, value):
        assert utils.is_valid_entry(value) == True
    
    @pytest.mark.parametrize("value", ["s12345", "123456"])
    def test_fails_for_invalid_supposed_meter_number(self, value):
        assert utils.is_valid_entry(value) == False

    @pytest.mark.parametrize("value", ["s123456", "1234567"])
    def test_passes_for_valid_supposed_numberic_meter_number(self, value):
        assert utils.is_valid_entry(value) == True


class TestApiClient(object):

    class DummyRegistry(object):
        def __init__(self, settings):
            self.settings = settings


    def test_get_api_client_returns_object(self, api_config):
        settings = {'api.kedco.%s' % key: value for key, value in api_config.items()}
        api_client = utils.get_api_client(TestApiClient.DummyRegistry(settings))
        assert api_client != None

    @pytest.mark.parametrize("args", [{}, {'host':'http://localhost:9889'}])
    def test_instantiation_fails_without_valid_config_params(self, args):
        with pytest.raises(ValueError):
            utils.ApiClient(**args)
    
    def test_instantiation_passes_for_valid_config_params(self, api_config):
        client = utils.ApiClient(**api_config)
        assert client != None
    
    @pytest.mark.parametrize("reftype, flag", [
        ('meter', True), ('meter', False), ('acctno', True), ('acctno', False)])
    def test_can_build_proper_api_url(self, api_config, reftype, flag):
        lookup = '01020304050'
        expected_fmt = (
            'http://localhost:9889/apiservice/105/{lookup}/778;'
            'referencetype={reftype}?postpaid={flag}')
        
        client = utils.ApiClient(**api_config)
        expected = expected_fmt.format(reftype=reftype, flag=flag, lookup=lookup)
        assert expected == client._get_url(lookup, reftype, flag)
    
