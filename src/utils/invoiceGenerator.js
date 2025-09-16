// Invoice Generator Module - Exact Layout Match
// Based on JAY JALARAM Electricals invoice format

export const generateInvoice = (invoiceData) => {
  // Debug log to see what data we're receiving
  console.log('Invoice data received:', invoiceData);
  console.log('Items in invoice data:', invoiceData.items);
  
  // Format currency for Indian locale
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert number to words (for amount in words)
  const numberToWords = (amount) => {
    // Simplified version - you can enhance this
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (amount === 0) return "Zero Only";
    if (amount < 10) return ones[amount] + " Only";
    if (amount < 20) return teens[amount - 10] + " Only";
    if (amount < 100)
      return tens[Math.floor(amount / 10)] + " " + ones[amount % 10] + " Only";
    if (amount < 1000)
      return (
        ones[Math.floor(amount / 100)] +
        " Hundred " +
        numberToWords(amount % 100).replace(" Only", "") +
        " Only"
      );
    if (amount < 100000)
      return (
        numberToWords(Math.floor(amount / 1000)).replace(" Only", "") +
        " Thousand " +
        numberToWords(amount % 1000).replace(" Only", "") +
        " Only"
      );

    return "Amount Only"; // Fallback for larger amounts
  };

  // Calculate GST amounts
  const baseAmount = invoiceData.totalAmount || 0;
  const cgstAmount = Math.round(baseAmount * 0.09);
  const sgstAmount = Math.round(baseAmount * 0.09);
  const totalWithGST = baseAmount + cgstAmount + sgstAmount;

  const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Invoice - ${invoiceData.invoiceNumber || "INV-001"}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.3;
            color: #000;
            background: white;
            margin: 0;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            background: white;
        }
        
        /* Header Section */
        .invoice-header {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: start;
            padding: 15px;
            border-bottom: 2px solid #000;
        }
        
        .company-info h1 {
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 1px;
        }
        
        .company-info .electricals {
            font-size: 16px;
            font-style: italic;
            margin-left: 120px;
            margin-top: -5px;
        }
        
        .header-right {
            text-align: right;
            font-size: 11px;
            line-height: 1.2;
        }
        
        /* Invoice Details Row */
        .invoice-details {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            border-bottom: 1px solid #000;
        }
        
        .gstin-section {
            padding: 8px;
            border-right: 1px solid #000;
        }
        
        .tax-invoice-section {
            padding: 8px;
            text-align: center;
            border-right: 1px solid #000;
            border: 2px solid #000;
            margin: 5px;
            background: #f8f8f8;
        }
        
        .msme-section {
            padding: 8px;
            font-size: 11px;
        }
        
        /* Address Section */
        .address-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #000;
        }
        
        .address-block {
            padding: 10px;
            border-right: 1px solid #000;
            min-height: 80px;
        }
        
        .address-block:last-child {
            border-right: none;
        }
        
        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .items-table th,
        .items-table td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-size: 11px;
        }
        
        .items-table th {
            background: #f0f0f0;
            font-weight: bold;
        }
        
        .items-table .particular-col {
            text-align: left;
            width: 200px;
        }
        
        /* Totals Section */
        .totals-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 2px solid #000;
        }
        
        .gst-summary {
            padding: 10px;
            border-right: 1px solid #000;
        }
        
        .amount-totals {
            padding: 10px;
            text-align: right;
        }
        
        .gst-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-top: 10px;
        }
        
        .gst-table th,
        .gst-table td {
            border: 1px solid #000;
            padding: 2px 4px;
            text-align: center;
        }
        
        /* Footer Section */
        .footer-section {
            display: grid;
            grid-template-columns: 1fr auto;
            border-top: 2px solid #000;
            padding: 10px;
            font-size: 11px;
        }
        
        .bank-details {
            line-height: 1.3;
        }
        
        .signature-section {
            text-align: center;
            padding: 0 20px;
        }
        
        .signature-box {
            border: 1px solid #000;
            padding: 10px;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
        }
        
        .signature-stamp {
            width: 80px;
            height: 60px;
            border: 1px solid #ccc;
            margin: 10px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            background: #f9f9f9;
        }
        
        @media print {
            body { margin: 0; padding: 10px; }
            .invoice-container { border: 1px solid #000; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-info">
                <h1>JAY JALARAM</h1>
                <div class="electricals">Electricals</div>
            </div>
            <div class="header-right">
                <div>Juna Jeen Hanuman Tekri,</div>
                <div>Opp. Ramji Mandir, Rander, Surat - 5</div>
                <div>Mo. No.- 7016388853</div>
                <div>Email Id:- jayalarameelectricals@gmail.com</div>
            </div>
        </div>

        <!-- Invoice Details Row -->
        <div class="invoice-details">
            <div class="gstin-section">
                <strong>GSTIN NO: 24CUOPS3532H1ZD</strong>
            </div>
            <div class="tax-invoice-section">
                <div style="font-weight: bold; margin-bottom: 5px;">TAX INVOICE</div>
                <div>Invoice No.: ${
                  invoiceData.invoiceNumber || "INV-001"
                }</div>
            </div>
            <div class="msme-section">
                <div><strong>MSME NO:UDYAM-GJ-22-0000271</strong></div>
                <div style="margin-top: 5px;">Date: ${formatDate(
                  invoiceData.date
                )}</div>
            </div>
        </div>

        <!-- Address Section -->
        <div class="address-section">
            <div class="address-block">
                <div><strong>To,</strong></div>
                <div>${
                  invoiceData.companyName ||
                  invoiceData.clientName ||
                  "Client Name"
                }</div>
                <div>${invoiceData.companyAddress || "Client Address"}</div>
                <div><strong>Site:</strong> ${
                  invoiceData.siteLocation || "Site Location"
                }</div>
            </div>
            <div class="address-block">
                <div><strong>Challan No.:</strong></div>
                <div><strong>Order No.:</strong></div>
                <div style="margin-top: 10px;"><strong>Party GST No.:</strong> ${
                  invoiceData.gstNumber || "24AACCM5772G2ZG"
                }</div>
                <div style="margin-top: 5px;"><strong>Date:</strong> ${formatDate(
                  invoiceData.date
                )}</div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 40px;">Sr. No.</th>
                    <th class="particular-col">Particular</th>
                    <th style="width: 50px;">Qty</th>
                    <th style="width: 60px;">HSN</th>
                    <th style="width: 70px;">Rate</th>
                    <th style="width: 60px;">CGST %</th>
                    <th style="width: 60px;">SGST %</th>
                    <th style="width: 80px;">Basic Amount</th>
                </tr>
            </thead>
            <tbody>
                ${
                  invoiceData.items && invoiceData.items.length > 0
                    ? invoiceData.items
                        .map(
                          (item, index) => {
                            console.log(`Item ${index + 1}:`, item);
                            return `
                        <tr>
                            <td>${index + 1}</td>
                            <td class="particular-col">${
                              item.description ||
                              item.particular ||
                              item.productName ||
                              "Electrical Services"
                            }</td>
                            <td>${item.quantity || 1}</td>
                            <td>${item.hsn || "998719"}</td>
                            <td>${(item.rate || item.basicAmount || baseAmount).toFixed(2)}</td>
                            <td>${item.gstRate || 9}%</td>
                            <td>${item.gstRate || 9}%</td>
                            <td>${(item.amount || item.total || item.basicAmount || baseAmount).toFixed(2)}</td>
                        </tr>
                    `;
                          }
                        )
                        .join("")
                    : `
                        <tr>
                            <td>1</td>
                            <td class="particular-col">${
                              invoiceData.workDescription || "Electrical Services"
                            }</td>
                            <td>1</td>
                            <td>998719</td>
                            <td>${baseAmount.toFixed(2)}</td>
                            <td>9%</td>
                            <td>9%</td>
                            <td>${baseAmount.toFixed(2)}</td>
                        </tr>
                    `
                }
                <!-- Empty rows to match layout -->
                ${Array(11)
                  .fill()
                  .map(
                    () => `
                    <tr>
                        <td>&nbsp;</td>
                        <td class="particular-col">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <!-- Totals Section -->
        <div class="totals-section">
            <div class="gst-summary">
                <div><strong>Total GST</strong></div>
                <div style="margin: 5px 0;">${numberToWords(totalWithGST)}</div>
                
                <div style="margin-top: 15px;"><strong>GST Summary :</strong></div>
                <table class="gst-table">
                    <thead>
                        <tr>
                            <th>GST%</th>
                            <th>Taxable Value</th>
                            <th>CGST 9%</th>
                            <th>SGST 9%</th>
                            <th>Total Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>18%</td>
                            <td>${baseAmount.toFixed(2)}</td>
                            <td>${cgstAmount}</td>
                            <td>${sgstAmount}</td>
                            <td>${cgstAmount + sgstAmount}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div style="margin-top: 10px;"><strong>Total Amt:</strong>${numberToWords(
                  totalWithGST
                )}</div>
            </div>
            
            <div class="amount-totals">
                <div style="margin-bottom: 8px;"><strong>Total :</strong> <span style="margin-left: 20px;">${baseAmount.toFixed(
                  2
                )}</span></div>
                <div style="margin-bottom: 8px;"><strong>CGST Amt. :</strong> <span style="margin-left: 20px;">${cgstAmount}.00</span></div>
                <div style="margin-bottom: 8px;"><strong>SGST Amt. :</strong> <span style="margin-left: 20px;">${sgstAmount}.00</span></div>
                <div style="margin-bottom: 8px; border-top: 1px solid #000; padding-top: 5px;"><strong>G. Total :</strong> <span style="margin-left: 20px;">${totalWithGST.toFixed(
                  2
                )}</span></div>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer-section">
            <div class="bank-details">
                <div><strong>A/C NO :</strong> 101142001000604</div>
                <div><strong>Bank name :</strong> Prime Co-Op. Bank LTD. &nbsp;&nbsp;<strong>Pincode:</strong> 395009</div>
                <div><strong>Branch :</strong> Palanpur Patiya &nbsp;&nbsp;<strong>IFSC Code :</strong> PMEC0101414</div>
                <div><strong>PAN NO :</strong> CUOPS3532H</div>
                <div style="margin-top: 15px; font-style: italic;">***All disputes will be subject to surat jurisdiction only</div>
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <div><strong>For Jay Jalaram Electricals</strong></div>
                    <div class="signature-stamp">
                        [STAMP]
                    </div>
                    <div><strong>Authorised Signatory</strong></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Auto print when page loads
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    </script>
</body>
</html>`;

  return invoiceHTML;
};

// Function to view invoice in new window (no auto-print)
export const viewInvoice = (invoiceData) => {
  const invoiceHTML = generateInvoice(invoiceData).replace(
    /<script>[\s\S]*?<\/script>/g,
    "" // Remove auto-print script
  );
  const viewWindow = window.open("", "_blank", "width=800,height=600");
  viewWindow.document.write(invoiceHTML);
  viewWindow.document.close();
};

// Function to open invoice in new window for printing/download
export const printInvoice = (invoiceData) => {
  const invoiceHTML = generateInvoice(invoiceData);
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
};

// Function to download invoice as HTML file
export const downloadInvoiceHTML = (invoiceData) => {
  const invoiceHTML = generateInvoice(invoiceData);
  const blob = new Blob([invoiceHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice_${invoiceData.invoiceNumber || "INV-001"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
