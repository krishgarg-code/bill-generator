import React, { useEffect, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js';


const Inputs = () => {
    const [gst, setgst] = useState('')
    const [tds2, settds2] = useState('')
    const [tds01, settds01] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const [be, setbe] = useState('')
    const [dalla, setdalla] = useState('')
    const [items, setItems] = useState([])
    const [partyName, setPartyName] = useState('')
    const [date, setDate] = useState('')
    const [vehicleNumber, setVehicleNumber] = useState('')
    const [showInvoice, setShowInvoice] = useState(false)
    const [bill, setBill] = useState('')
    const [amount, setAmount] = useState('')
    const [quanrev, setQuanrev] = useState('')
    const [Dust, setDust] = useState('')

    const totalquantity = quanrev - Dust

    // Refs for all inputs (in order of focus)
    const inputRefs = useRef([])
    const addInputRef = (el) => {
        if (el && !inputRefs.current.includes(el)) {
            inputRefs.current.push(el)
        }
    }

    // Autofocus on Party Name
    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    // Keyboard navigation
    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const next = inputRefs.current[index + 1]
            if (next) next.focus()
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const next = inputRefs.current[index + 1]
            if (next) next.focus()
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prev = inputRefs.current[index - 1]
            if (prev) prev.focus()
        }

        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault()
            handleGenerate()
        }

        if (e.key === 'Shift') {
            e.preventDefault()
            handleAdd()
        }
    }


    const handleAdd = () => {
        if (quantity && price && !isNaN(quantity) && !isNaN(price)) {
            setItems([...items, { quantity: parseFloat(quantity), price: parseFloat(price) }])
            setQuantity('')
            setPrice('')
        } else {
            alert('Please enter valid quantity and price')
        }
    }

    const itemTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const OPFP = (itemTotal * 0.015).toFixed(0)
    const sTotal = (itemTotal - parseFloat(OPFP)).toFixed(0)
    const number = 67
    const grandTotal =
        items.length || gst || be || tds2 || tds01 || dalla
            ? (
                parseFloat(sTotal || 0) +
                parseFloat(gst || 0) -
                parseFloat(be || 0) -
                parseFloat(tds2 || 0) -
                parseFloat(tds01 || 0) -
                parseFloat(dalla || 0) -
                number
            ).toFixed(2)
            : '0.00'

    const handleGenerate = () => {
        if (!partyName || !date || !vehicleNumber || items.length === 0) {
            alert('Please fill all required fields')
            return
        }
        setShowInvoice(true)
    }

    const endtotal = amount - grandTotal

    const deleteItem = (index) => {
        const newItems = items.filter((_, idx) => idx !== index)
        setItems(newItems)
    }

    const handlePrint = () => {
        const printContents = document.getElementById('invoice-section').innerHTML
        const printWindow = window.open('', '_blank', 'height=800,width=800')

        printWindow.document.write('<html><head><title>Invoice</title>')
        printWindow.document.write('<style>')
        printWindow.document.write(`
            @media print {
                @page {
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 40px;
                    font-family: 'Segoe UI', sans-serif;
                    color: #000;
                }
                .no-print {
                    display: none !important;
                }
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                border-bottom: 1px solid #ccc;
                text-align: left;
            }
            h2, h3, h4, p {
                margin: 5px 0;
            }
            img {
                width: 100px;
                margin-bottom: 20px;
            }
        `)
        printWindow.document.write('</style></head><body>')
        printWindow.document.write(printContents)
        printWindow.document.write('</body></html>')

        printWindow.document.close()

        printWindow.onload = () => {
            printWindow.focus()
            printWindow.print()
            printWindow.close()
        }
    }

    const handleDownloadPDF = () => {
        // Format date as dd-mm-yy
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        const fileName = `${partyName || 'Invoice'}-${day}-${month}-${year}.pdf`;

        const element = document.getElementById('invoice-section');

        // Create a style element with minimal, print-like styles
        const style = document.createElement('style');
        style.innerHTML = `
            body, .invoice-section {
                background: #fff !important;
                color: #000 !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border-radius: 0 !important;
            }
            .invoice-section {
                padding: 0 !important;
                margin: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
            }
            .no-print {
                display: none !important;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                border-bottom: 1px solid #888;
                text-align: left;
                color: #000 !important;
                background: #fff !important;
            }
            th {
                font-weight: bold;
            }
            h2, h3, h4, p {
                margin: 5px 0;
                color: #000 !important;
            }
            hr {
                border: none;
                border-top: 1.5px solid #888;
                margin: 18px 0;
            }
            strong {
                color: #000 !important;
            }
            .grand-total-red {
        color: red !important;
        font-weight: bold;
        font-size: 1.2em;
    }
    .grand-total-green {
        color: green !important;
        font-weight: bold;
        font-size: 1.2em;
    }
`;
document.head.appendChild(style);

        // Clone the invoice-section and append the style
        const clone = element.cloneNode(true);
        clone.insertBefore(style, clone.firstChild);

        // Fix the Grand Total color (if present)
        const h3s = clone.querySelectorAll('h3');
        h3s.forEach(h3 => {
            if (h3.style.color === 'red') {
                h3.classList.add('grand-total-red');
                h3.style.color = '';
            }
        });

        // Create a temporary container for html2pdf
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(clone);
        document.body.appendChild(tempDiv);

        html2pdf()
            .set({
                margin: 0.5,
                filename: fileName,
                html2canvas: { scale: 2, backgroundColor: '#fff' },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            })
            .from(clone)
            .save()
            .then(() => {
                document.body.removeChild(tempDiv);
            });
    };

    return (
        <>
            {/* Top Left Branding */}
            <div className="branding">Bill Genrator </div>

            <div className='header'>
                <div className="form-row">
                    {/* Column 1 */}
                    <div className="form-column">
                        <label>Party Name:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 0)} type="text" value={partyName} onChange={(e) => setPartyName(e.target.value)} />

                        <label>Basic price:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 1)} type="text" value={bill} onChange={(e) => setBill(e.target.value)} />

                        <label>Net Amount:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 2)} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />

                        <label>Quantity Received:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 3)} type="text" value={quanrev} onChange={(e) => setQuanrev(e.target.value)} />

                        <label>Dust:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 4)} type="text" value={Dust} onChange={(e) => setDust(e.target.value)} />

                        <label>Date:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 5)} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                        <label>Vehicle Number:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 6)} type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                    </div>
                    {/* Column 2 */}
                    <div className="form-column2">
                        <label>GST:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 7)} type="text" value={gst} onChange={(e) => setgst(e.target.value)} />

                        <label>TDS (2%):</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 8)} type="text" value={tds2} onChange={(e) => settds2(e.target.value)} />

                        <label>TDS (0.1%):</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 9)} type="text" value={tds01} onChange={(e) => settds01(e.target.value)} />

                        <div className="input-group">
                            <label>Quantity:</label>
                            <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 10)} type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <label>Price:</label>
                            <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 11)} type="text" value={price} onChange={(e) => setPrice(e.target.value)} />

                            <button className='buttonadd' onClick={handleAdd}>Add</button>
                        </div>
                        {items.length >= 0 && (
                            


                            <div
  style={{
    height: '40px', // fixed height to allow scroll
    overflowY: items.length > 2 ? 'auto' : 'hidden', // scroll only if > 2
    // border: '1px solid #ccc',
    padding: '8px',
    marginTop: '10px',
    borderRadius: '10px',
    backgroundColor: '#181c2f',
  }}
>
  {items.length === 0 ? (
    <p style={{ color: '#999' }}>No items added yet.</p>
  ) : (
    <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
      {items.map((item, idx) => (
        <li key={idx} onClick={()=>deleteItem(idx)} style={{ cursor: 'pointer', color: '#fff', marginBottom: '5px' }}>
          •‎ ‎  {item.quantity} × {item.price} = {(item.quantity * item.price).toFixed(0)} 
        </li>
      ))}
    </ul>
  )}
</div>
                        )}




                        <label>Billing Excess:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 12)} type="text" value={be} onChange={(e) => setbe(e.target.value)} />

                        <label>Dalla:</label>
                        <input ref={addInputRef} onKeyDown={(e) => handleKeyDown(e, 13)} type="text" value={dalla} onChange={(e) => setdalla(e.target.value)} />

                        <p>Dhara (1.5%): ₹{OPFP}</p>
                    </div>
                </div>
            </div>
            {/* Add form-actions container below the form-row */}
            <div className="form-actions">
                <button onClick={() => {
                    setgst('')
                    settds2('')
                    settds01('')
                    setQuantity('')
                    setPrice('')
                    setbe('')
                    setdalla('')
                    setItems([])
                    setPartyName('')
                    setDate('')
                    setVehicleNumber('')
                    setBill('')
                    setAmount('')
                    setQuanrev('')
                    setDust('')
                }}>Reset</button>
                <button onClick={handleGenerate}>Generate Bill</button>
            </div>


            {/* Modal Popup for Invoice */}
            {showInvoice && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="invoice-section" id="invoice-section">
                            <br />
                            <p><strong>Party Name:</strong> {partyName}</p>
                            <p><strong>Date:</strong> {date}</p>
                            <p><strong>Vehicle Number:</strong> {vehicleNumber}</p>
                            <p><strong>Basic price:</strong> {bill}</p>
                            <p><strong>Final Weight:</strong> {quanrev} - {Dust} = {totalquantity}</p>
                            <hr />

                            <table>
                                <thead>
                                    <tr>
                                        <th>QTY</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p><strong>Subtotal:</strong> ₹{itemTotal.toFixed(2)}</p>
                            <p><strong>Dhara (1.5%):</strong> ₹{OPFP}</p>
                            <p><strong>GST:</strong> ₹{gst}</p>
                            <p><strong>TDS (2%):</strong> ₹{tds2}</p>
                            <p><strong>TDS (0.1%):</strong> ₹{tds01}</p>
                            <p><strong>Billing Excess:</strong> ₹{be}</p>
                            <p><strong>Dalla:</strong> ₹{dalla}</p>
                            <p><strong>Bank Charges:</strong> ₹{number}</p>
                            <hr />

                            {amount ? (
                                <h3 style={{ color: endtotal < 0 ? 'red' : 'green' }}>
                                    Grand Total: ₹{endtotal}
                                </h3>
                            ) : (
                                <h3 style={{ color: 'black' }}>
                                    Grand Total: ₹{grandTotal}
                                </h3>
                            )}

                            <br />

                            <div className="no-print">
                                <button onClick={handleDownloadPDF}>Download PDF</button>
                                <button onClick={handlePrint}>Print</button>
                                <button onClick={() => setShowInvoice(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Inputs








