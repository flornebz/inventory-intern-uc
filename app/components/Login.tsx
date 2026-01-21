"use client";

import { useState } from "react";
import { Package, Lock, Mail } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import supabase from "../lib/client";
import type { User } from "../page";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Login failed", {
        description: "NIK and password are required",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("email, role")
      .eq("email", email)
      .eq("password", password)
      .single();

    setLoading(false);

    if (error || !data) {
      toast.error("Login failed", {
        description: "Invalid NIK or password",
      });
      return;
    }

    // ✅ ROLE FROM DATABASE
    onLogin({
      email: data.email,
      role: data.role,
    });

    toast.success("Login Successful", {
      description:
        data.role === "staff"
          ? "Welcome Academic Support Staff!"
          : "Welcome Lecturer!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-2xl mb-4 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stationery Inventory System
          </h1>
          <p className="text-gray-600">
            Campus Stationery Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your NIK and password to access the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIK */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                User ID / NIK
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  placeholder="20090066"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 text-black bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 text-black bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base shadow-lg shadow-orange-500/30"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2026 University Ciputra Inventory System 
        </div>
      </div>
    </div>
  );
}
