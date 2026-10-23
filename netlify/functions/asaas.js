/**
 * Proxy Asaas API — esconde a API Key e evita CORS.
 * Body: { action, apiKey, sandbox, ...params }
 */
const BASE_PROD = 'https://api.asaas.com/v3';
const BASE_SB = 'https://api-sandbox.asaas.com/v3';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { action, apiKey, sandbox } = body;
  if (!apiKey || !String(apiKey).trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'API Key Asaas obrigatória. Configure em Configurações.' }) };
  }
  if (!action) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'action obrigatória' }) };
  }

  const base = sandbox ? BASE_SB : BASE_PROD;

  async function asaas(method, path, payload) {
    const res = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': String(apiKey).trim()
      },
      body: payload ? JSON.stringify(payload) : undefined
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
    return { status: res.status, data };
  }

  try {
    let result;

    if (action === 'createCustomer') {
      result = await asaas('POST', '/customers', {
        name: body.name,
        cpfCnpj: String(body.cpfCnpj || '').replace(/\D/g, ''),
        email: body.email || undefined,
        mobilePhone: body.mobilePhone ? String(body.mobilePhone).replace(/\D/g, '') : undefined,
        externalReference: body.externalReference || undefined
      });
    } else if (action === 'findCustomerByCpf') {
      const cpf = String(body.cpfCnpj || '').replace(/\D/g, '');
      result = await asaas('GET', '/customers?cpfCnpj=' + encodeURIComponent(cpf));
    } else if (action === 'paymentLinkRecurrent') {
      result = await asaas('POST', '/paymentLinks', {
        name: body.name || 'Assinatura Complexo Presida',
        description: body.description || 'Plano recorrente',
        value: Number(body.value),
        billingType: body.billingType || 'CREDIT_CARD',
        chargeType: 'RECURRENT',
        subscriptionCycle: body.cycle || 'MONTHLY',
        notificationEnabled: true,
        externalReference: body.externalReference || undefined
      });
    } else if (action === 'paymentLinkQuick') {
      result = await asaas('POST', '/paymentLinks', {
        name: body.name || 'Cobrança Complexo Presida',
        description: body.description || 'Pagamento avulso',
        value: Number(body.value),
        billingType: body.billingType || 'UNDEFINED',
        chargeType: 'DETACHED',
        dueDateLimitDays: body.dueDateLimitDays || 5,
        notificationEnabled: true,
        externalReference: body.externalReference || undefined
      });
    } else if (action === 'createSubscription') {
      result = await asaas('POST', '/subscriptions', {
        customer: body.customer,
        billingType: body.billingType || 'UNDEFINED',
        nextDueDate: body.nextDueDate,
        value: Number(body.value),
        cycle: body.cycle || 'MONTHLY',
        description: body.description || 'Assinatura Complexo Presida',
        externalReference: body.externalReference || undefined
      });
    } else if (action === 'listPayments') {
      const q = new URLSearchParams();
      if (body.customer) q.set('customer', body.customer);
      if (body.subscription) q.set('subscription', body.subscription);
      if (body.status) q.set('status', body.status);
      if (body.externalReference) q.set('externalReference', body.externalReference);
      q.set('limit', String(body.limit || 20));
      result = await asaas('GET', '/payments?' + q.toString());
    } else if (action === 'getPayment') {
      result = await asaas('GET', '/payments/' + encodeURIComponent(body.paymentId));
    } else if (action === 'listSubscriptionPayments') {
      result = await asaas('GET', '/subscriptions/' + encodeURIComponent(body.subscriptionId) + '/payments');
    } else if (action === 'test') {
      result = await asaas('GET', '/finance/balance');
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'action desconhecida: ' + action }) };
    }

    return {
      statusCode: result.status >= 200 && result.status < 300 ? 200 : result.status,
      headers,
      body: JSON.stringify(result.data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Erro no proxy Asaas' })
    };
  }
};
