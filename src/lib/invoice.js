// Shared invoice generator used by admin pages
export function generateAndDownloadInvoice(order) {
  if (!order) return;
  const orderNumber = order.orderNumber || (order._id && order._id.slice(-8)) || 'order';
  const date = new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const customerName = order.customerInfo?.name || order.customer?.name || 'Customer';
  const customerEmail = order.customerInfo?.email || order.customer?.email || '';
  const total = order.pricing?.total || 0;
  const subtotal = order.pricing?.subtotal || 0;
  const shipping = order.pricing?.shipping || 0;
  const discount = order.pricing?.discount || 0;
  const paymentMethod = order.payment?.method || 'N/A';
  const paymentStatus = order.payment?.status || 'pending';

  const itemsHtml = (order.items || []).map(it => {
    const title = it.productInfo?.title || it.product?.title || 'Product';
    const qty = it.quantity || 1;
    const unit = it.price || 0;
    const totalPrice = (it.price || 0) * qty;
    return `<tr>
      <td style="padding:12px;vertical-align:top">${title}${it.size ? `<div style="font-size:12px;color:#64748b">Size: ${it.size}</div>` : ''}</td>
      <td style="padding:12px;text-align:right;vertical-align:top">₹${unit.toLocaleString('en-IN')}</td>
      <td style="padding:12px;text-align:right;vertical-align:top">₹${totalPrice.toLocaleString('en-IN')}</td>
    </tr>`;
  }).join('');

  const companyName = 'Ambika International';
  const companyAddress = 'Office: 123, Market Road, City - State, PIN';
  const companyPhone = '+91 98791 95322';
  const companyEmail = 'ambika.international30@gmail.com';

  const html = `<!doctype html>
    <html lang="en"><head><meta charset="utf-8"><title>Invoice ${orderNumber}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
      :root{--bg:#ffffff;--muted:#64748b;--accent:#0f172a;--primary:#0ea5e9}
      body{font-family:'Prompt',Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;box-sizing:border-box;background:var(--bg);color:var(--accent);padding:24px}
      .sheet{max-width:900px;margin:0 auto;background:linear-gradient(180deg,#ffffff 0%,#fbfdff 100%);border-radius:10px;padding:28px;border:1px solid #eef2f7}
      header{display:flex;justify-content:space-between;align-items:flex-start}
      .company{display:flex;gap:16px;align-items:center}
      .logo{width:64px;height:64px;background:linear-gradient(135deg,#06b6d4,#3b82f6);border-radius:12px;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}
      h1{margin:0;font-size:18px}
      .meta{text-align:right}
      .meta div{font-size:13px;color:var(--muted)}
      .grid{display:flex;gap:18px;margin-top:18px}
      .box{flex:1;padding:14px;border-radius:8px;background:#fbfdff;border:1px solid #f1f5f9}
      table{width:100%;border-collapse:collapse;margin-top:18px}
      th{background:#f8fafc;text-align:left;padding:10px;border-bottom:1px solid #eef2f7;color:var(--muted);font-weight:600}
      td{padding:12px;border-bottom:1px solid #eef2f7}
      .totals{margin-top:18px;display:flex;justify-content:flex-end}
      .totals .inner{width:320px}
      .totals .row{display:flex;justify-content:space-between;padding:8px 0;color:var(--muted)}
      .totals .row.total{font-weight:700;color:var(--accent);font-size:18px}
      footer{margin-top:28px;padding-top:12px;border-top:1px dashed #e6eef8;color:var(--muted);font-size:12px;text-align:center}
      @media print{body{padding:0}.sheet{box-shadow:none;border:none}}
    </style>
    </head><body>
    <div class="sheet">
      <header>
        <div class="company">
          <div class="logo">AI</div>
          <div>
            <h1>${companyName}</h1>
            <div style="color:var(--muted);font-size:13px;margin-top:4px">${companyAddress}<br/>Phone: ${companyPhone} • ${companyEmail}</div>
          </div>
        </div>
        <div class="meta">
          <div style="font-size:12px;color:var(--muted)">Invoice</div>
          <div style="font-weight:700;margin-top:6px">#${orderNumber}</div>
          <div style="margin-top:6px;color:var(--muted)">${date}</div>
        </div>
      </header>

      <div class="grid">
        <div class="box">
          <strong>Bill To</strong>
          <div style="margin-top:8px">${customerName}</div>
          ${order.customerInfo?.address ? `<div style="margin-top:6px;color:var(--muted);font-size:13px">${order.customerInfo.address}</div>` : ''}
          ${customerEmail ? `<div style="margin-top:6px;color:var(--muted);font-size:13px">${customerEmail}</div>` : ''}
        </div>
        <div class="box">
          <strong>Payment</strong>
          <div style="margin-top:8px;color:var(--muted);font-size:13px">Method: <span style="color:var(--accent);font-weight:600">${paymentMethod}</span></div>
          <div style="margin-top:6px;color:var(--muted);font-size:13px">Status: <span style="font-weight:600">${paymentStatus}</span></div>
        </div>
      </div>

      <table aria-hidden="false">
        <thead>
          <tr>
            <th style="width:60%">Item</th>
            <th style="width:20%;text-align:right">Unit Price</th>
            <th style="width:20%;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="inner">
          <div class="row"><div>Subtotal</div><div>₹${subtotal.toLocaleString('en-IN')}</div></div>
          <div class="row"><div>Shipping</div><div>₹${shipping.toLocaleString('en-IN')}</div></div>
          ${discount > 0 ? `<div class="row"><div>Discount</div><div>-₹${discount.toLocaleString('en-IN')}</div></div>` : ''}
          <div class="row total"><div>Total</div><div>₹${total.toLocaleString('en-IN')}</div></div>
        </div>
      </div>

      <footer>
        Thank you for your purchase. If you have any questions, contact ${companyEmail} or call ${companyPhone}.
      </footer>
    </div>
    </body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice_${orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default generateAndDownloadInvoice;
