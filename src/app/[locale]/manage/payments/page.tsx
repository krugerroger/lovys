"use client";
// app/manage/payments/page.tsx
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function TopUpBalancePage() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('topup');

  const amounts = ['$10', '$25', '$35', '$50', '$100'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('topup')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'topup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Top up balance
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>

        {activeTab === 'topup' && (
          <>
            {/* Select Amount */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Select an amount</h3>
              <div className="flex flex-wrap gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`px-8 py-3 border-2 rounded transition ${
                      selectedAmount === amount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedAmount('custom')}
                  className={`px-8 py-3 border-2 rounded transition ${
                    selectedAmount === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  custom
                </button>
              </div>
              {selectedAmount === 'custom' && (
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="mt-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Choose payment method</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedPayment('crypto')}
                  className={`relative px-8 py-6 border-4 rounded-lg transition ${
                    selectedPayment === 'crypto'
                      ? 'border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="bg-black rounded-lg p-4 flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-1">
                        ₿
                      </div>
                      <span className="text-white text-xs">BTC</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-xl mb-1">
                        ₮
                      </div>
                      <span className="text-white text-xs">USDT</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl mb-1">
                        ♦
                      </div>
                      <span className="text-white text-xs">ETH</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPayment('tether')}
                  className={`relative px-12 py-6 border-4 rounded-lg transition ${
                    selectedPayment === 'tether'
                      ? 'border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="bg-teal-600 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="text-white font-bold text-3xl mb-1">tether</div>
                    <div className="text-teal-200 text-sm">TRC-20</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="mb-12">
              <button className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium">
                Proceed to payment
              </button>
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Help</h3>

          {/* Instructions for paying by Card */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm shrink-0 mt-1">
                ?
              </div>
              <span className="text-gray-700 font-medium">Instructions for paying by Card</span>
            </div>
            <div className="flex gap-3 ml-9">
              <button className="px-6 py-3 bg-blue-400 text-white rounded hover:bg-blue-500 transition flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                Telegram
              </button>
              <button className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 transition flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-600 rounded"></div>
                <span className="text-sm">ethereum</span>
              </button>
              <button className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center gap-2">
                <span className="text-yellow-500 font-bold text-xl">₿</span>
                bitcoin
              </button>
            </div>
          </div>

          {/* Instructions for buy bitcoin by BANK card */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm shrink-0 mt-1">
                ?
              </div>
              <span className="text-gray-700 font-medium">Instructions for buy bitcoin by BANK card</span>
            </div>
            <div className="flex flex-wrap gap-3 ml-9">
              <a 
                href="#"
                className="px-5 py-2 border border-gray-300 rounded hover:border-gray-400 transition flex items-center gap-2"
              >
                <span className="text-gray-700">Ramp</span>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
              <a 
                href="#"
                className="px-5 py-2 border border-gray-300 rounded hover:border-gray-400 transition flex items-center gap-2"
              >
                <span className="text-gray-700">Bitcoin.com</span>
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-orange-500">min $8</span>
              </a>
              <a 
                href="#"
                className="px-5 py-2 border border-gray-300 rounded hover:border-gray-400 transition flex items-center gap-2"
              >
                <span className="text-gray-700">Mycelium</span>
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-orange-500">min $50</span>
              </a>
              <a 
                href="#"
                className="px-5 py-2 border border-gray-300 rounded hover:border-gray-400 transition flex items-center gap-2"
              >
                <span className="text-gray-700">Bitcoin ATM</span>
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-orange-500">min $25</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}