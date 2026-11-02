import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Calendar, CreditCard, Download } from 'lucide-react';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Payment Receipt & Invoice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Printable Receipt Area */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-200" id="printable-receipt">
          {/* Header */}
          <div className="border-b border-slate-700/80 pb-5 mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold tracking-tight text-white">RBAC PORTAL</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 der border-indigo-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400">Subscription Billing & Access Management</p>
              <p className="text-xs text-slate-400">Razorpay Test Gateway</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Official Payment Receipt
              </span>
              <p className="text-sm font-mono text-white font-bold">{receipt.invoiceNumber}</p>
              <p className="text-xs text-slate-400">
                Date: {new Date(receipt.paymentDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer & Plan Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-3.5 bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block mb-1">
                Billed To
              </span>
              <p className="text-sm font-bold text-white">{receipt.customer?.name}</p>
              <p className="text-slate-300">{receipt.customer?.email}</p>
            </div>

            <div className="p-3.5 bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px] block mb-1">
                Gateway Reference
              </span>
              <p className="text-slate-300">
                <strong className="text-slate-400">Order:</strong> {receipt.paymentDetails?.orderId}
              </p>
              <p className="text-slate-300">
                <strong className="text-slate-400">Payment:</strong> {receipt.paymentDetails?.paymentId}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs mb-6 border border-slate-800 overflow-hidden">
            <thead className="bg-slate-800/80 text-slate-300 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Plan Description</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3">
                  <p className="font-semibold text-white">{receipt.plan?.name} Plan Subscription</p>
                  <p className="text-[11px] text-slate-400">{receipt.plan?.description}</p>
                </td>
                <td className="p-3 text-center text-slate-300">
                  {receipt.plan?.durationInDays} Days
                </td>
                <td className="p-3 text-right font-bold text-white text-sm">
                  ₹{receipt.paymentDetails?.amount}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-800/40 border-t border-slate-700">
              <tr>
                <td colSpan="2" className="p-3 font-semibold text-right text-slate-300">
                  Total Paid:
                </td>
                <td className="p-3 text-right font-extrabold text-emerald-400 text-base">
                  ₹{receipt.paymentDetails?.amount}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Subscription Validity Information */}
          {receipt.subscriptionValidity && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-xs mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>
                  <strong>Subscription Validity:</strong>{' '}
                  {new Date(receipt.subscriptionValidity.startDate).toLocaleDateString()} to{' '}
                  {new Date(receipt.subscriptionValidity.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <span className="px-2 py-0.5 t-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                {receipt.subscriptionValidity.status}
              </span>
            </div>
          )}

          {/* Footer Note */}
          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 text-center">
            <p>{receipt.note || 'This is a computer-generated receipt and requires no physical signature.'}</p>
            <p className="mt-1 text-[10px] text-slate-400">
              Status: Verified Captured via Razorpay Test Integration
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
