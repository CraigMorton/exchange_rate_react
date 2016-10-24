const formatCurrency = (price, currency) => {
  if (price == null) return price;
  const currencySettingLookup = {
    'EUR': ['en-eu', {style: 'currency', currency: 'EUR'}],
    'AUD': ['en-au', {style: 'currency', currency: 'AUD'}],
    'BGN': ['bg', {style: 'currency', currency: 'BGN'}],
    'BRL': ['pt-br', {style: 'currency', currency: 'BRL'}],
    'CAD': ['en-ca', {style: 'currency', currency: 'CAD'}],
    'CHF': ['de-ch', {style: 'currency', currency: 'CHF'}],
    'CNY': ['zh-cn', {style: 'currency', currency: 'CNY'}],
    'CZK': ['cs', {style: 'currency', currency: 'CZK'}],
    'DKK': ['da', {style: 'currency', currency: 'DKK'}],
    'GBP': ['en-UK', {style: 'currency', currency: 'GBP'}],
    'HKD': ['zh-hk', {style: 'currency', currency: 'HKD'}],
    'HRK': ['hr', {style: 'currency', currency: 'HRK'}],
    'HUF': ['hu', {style: 'currency', currency: 'HUF'}],
    'IDR': ['id', {style: 'currency', currency: 'IDR'}],
    'ILS': ['il', {style: 'currency', currency: 'ILS'}],
    'INR': ['hi', {style: 'currency', currency: 'INR'}],
    'JPY': ['ja', {style: 'currency', currency: 'JPY'}],
    'KRW': ['ko', {style: 'currency', currency: 'KRW'}],
    'MXN': ['es-mx', {style: 'currency', currency: 'MXN'}],
    'MYR': ['ms-my', {style: 'currency', currency: 'MYR'}],
    'NOK': ['no-no', {style: 'currency', currency: 'NOK'}],
    'NZD': ['en-nz', {style: 'currency', currency: 'NZD'}],
    'PHP': ['en-ph', {style: 'currency', currency: 'PHP'}],
    'PLN': ['pl', {style: 'currency', currency: 'PLN'}],
    'RON': ['ro', {style: 'currency', currency: 'RON'}],
    'RUB': ['ru', {style: 'currency', currency: 'RUB'}],
    'SEK': ['sv-se', {style: 'currency', currency: 'SEK'}],
    'SGD': ['zh-sg', {style: 'currency', currency: 'SGD'}],
    'THB': ['th', {style: 'currency', currency: 'THB'}],
    'TRY': ['tr', {style: 'currency', currency: 'TRY'}],
    'USD': ['en-US', {style: 'currency', currency: 'USD'}],
    'ZAR': ['en-za', {style: 'currency', currency: 'ZAR'}]
  }
  if (currencySettingLookup[currency] == null && currencySettingLookup[currency].length > 0){
    return price.toLocaleString(...(currencySettingLookup[currency]));
  }
};

export {formatCurrency}
