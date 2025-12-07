"use client";
// app/profile/page.tsx
import React, { useState } from 'react';
import { Star, Heart, User, LogOut } from 'lucide-react';
import Header from '@/components/Header';

export default function LadysOneHome() {
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedLanguage, setSelectedLanguage] = useState('Choose language');
  const [phoneNumber, setPhoneNumber] = useState('');

  const popularLocations = [
    ['New York escorts', 'Singapore escorts', 'Chicago escorts', 'Miami escorts'],
    ['Philadelphia escorts', 'Washington DC escorts', 'Luxembourg escorts', 'Los Angeles escorts'],
    ['Las Vegas escorts', 'Boston escorts', 'San Francisco escorts', 'Houston escorts'],
    ['Salt Lake City escorts', 'Honolulu escorts', 'Stockholm escorts', 'Hong Kong escorts'],
    ['Tokyo escorts', 'Saint Julian escorts', 'London escorts', 'Paris escorts'],
    ['San Antonio escorts', 'Dallas escorts', 'Phoenix escorts', 'Columbus, Oh escorts'],
    ['Atlanta escorts', 'Wien escorts', 'Nice escorts', 'Lyon escorts'],
    ['Kuala Lumpur escorts', 'San Jose escorts', 'San Diego escorts', 'Seattle escorts'],
    ['Sacramento escorts', 'Edmonton escorts', 'Vancouver escorts', 'Ottawa escorts'],
    ['Montreal escorts', 'Manama escorts', 'Dubai escorts', 'Abu Dhabi escorts'],
    ['Istanbul escorts', 'Cleveland escorts', 'Denver escorts', 'Seoul escorts'],
    ['Taipei escorts', 'Manila escorts', 'Amman escorts', 'Al Kuwait escorts'],
    ['Goteborg escorts', 'Malmo escorts', 'Cairo escorts', 'Riyadh escorts'],
    ['Dammam escorts', 'Detroit escorts', 'Minneapolis escorts', 'Kansas City escorts'],
    ['Brooklyn escorts', 'Manhattan escorts', 'Long Island escorts', 'Oklahoma City escorts'],
    ['Tulsa escorts', 'Portland escorts', 'Pittsburgh escorts', 'Nashville escorts'],
    ['Milwaukee escorts', 'Milan escorts', 'Toronto escorts', 'New Jersey escorts'],
    ['Atlantic City escorts', '', '', '']
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Escort Services Near Me */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-pink-400">🎀</span>
            Escort Services Near Me
          </h2>
          
          <div className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option>All cities</option>
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option>Choose language</option>
            </select>

            <button className="w-full py-3 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-semibold">
              ENTER
            </button>

            <p className="text-xs text-gray-400">
              With entering the site I accept the terms of use below.
            </p>
          </div>

          {/* Escort Reviews Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-400">💖</span>
              Escort reviews: <span className="text-pink-300">1765491</span>
            </h2>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex max-sm:flex-col gap-2">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number..."
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button className="px-8 py-3 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-semibold">
                  GO
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-gray-300 mb-2">INPUT FORMAT:</p>
                <p className="text-sm text-gray-400 mb-3">Country code + phone number</p>
                <p className="text-xs text-gray-400">USA: +12023034455</p>
                <p className="text-xs text-gray-400">UK: +445566889900065</p>
              </div>

              <div className="mt-4 text-right">
                <button className="text-sm text-pink-300 hover:text-pink-400 underline">
                  Add review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Most Popular Locations */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-pink-400">🌍</span>
            Most popular locations
          </h2>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="grid grid-cols-4 gap-x-4 gap-y-3">
              {popularLocations.flat().map((location, idx) => (
                location ? (
                  <a
                    key={idx}
                    href="#"
                    className="text-xs text-pink-300 hover:text-pink-400 hover:underline"
                  >
                    {location}
                  </a>
                ) : <div key={idx}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}