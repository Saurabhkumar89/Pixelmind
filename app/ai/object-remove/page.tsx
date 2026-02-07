'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Trash2, Download, Upload } from 'lucide-react';

export default function ObjectRemovePage() {
  const { user, token } = useAuth();
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Remove Object</h1>
            <p className="text-muted-foreground">Remove unwanted objects from images</p>
            <p className="text-sm text-blue-400 mt-2">Cost: 2 credits</p>
          </div>

          {user && (
            <div className="mb-6 p-4 glass rounded-lg">
              <p className="text-sm">Credits: <span className="font-bold">{user.credits}</span></p>
            </div>
          )}

          <div className="glass rounded-lg p-8 text-center">
            <Trash2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Object Removal Tool</h3>
            <p className="text-muted-foreground mb-6">Select areas and remove objects intelligently with AI</p>
            <label className="glass rounded-lg p-8 cursor-pointer hover:bg-white/15 transition flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mb-2" />
              <p className="text-sm">Click to upload image</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {image && <img src={image || "/placeholder.svg"} alt="Upload" className="w-full mt-6 rounded-lg" />}
          </div>
        </div>
      </div>
    </div>
  );
}
