// src/hooks/usePromoCode.js

import { useState } from "react";
import { promoCodes } from "../config/promoCodes";
import { toast } from "react-hot-toast";

export const usePromoCode = (subtotal) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);

  const validatePromoCode = (code) => {
    // Find the promo code
    const promo = promoCodes.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (!promo) {
      return { valid: false, message: "Invalid promo code" };
    }

    // Check if expired
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return { valid: false, message: "This promo code has expired" };
    }

    // Check minimum order
    if (promo.minOrder && subtotal < promo.minOrder) {
      return {
        valid: false,
        message: `Minimum order of $${promo.minOrder} required for this code`,
      };
    }

    return { valid: true, promo };
  };

  const applyPromoCode = (code) => {
    setIsApplying(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const result = validatePromoCode(code);

      if (result.valid) {
        setAppliedCode(result.promo);
        setPromoCode("");
        toast.success(`Promo code "${result.promo.code}" applied!`);
      } else {
        setError(result.message);
        toast.error(result.message);
      }

      setIsApplying(false);
    }, 500);
  };

  const removePromoCode = () => {
    setAppliedCode(null);
    setError(null);
    toast.success("Promo code removed");
  };

  const calculateDiscount = (subtotal) => {
    if (!appliedCode) return { discount: 0, finalSubtotal: subtotal };

    let discountAmount = 0;

    if (appliedCode.type === "percentage") {
      discountAmount = (subtotal * appliedCode.discount) / 100;
      if (appliedCode.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCode.maxDiscount);
      }
    } else if (appliedCode.type === "fixed") {
      discountAmount = Math.min(appliedCode.discount, subtotal);
    } else if (appliedCode.type === "free_shipping") {
      // Shipping will be free
      discountAmount = 0;
    }

    return {
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalSubtotal: subtotal - discountAmount,
    };
  };

  const discountInfo = calculateDiscount(subtotal);
  const isFreeShipping = appliedCode?.type === "free_shipping";

  return {
    promoCode,
    setPromoCode,
    appliedCode,
    isApplying,
    error,
    applyPromoCode,
    removePromoCode,
    discountInfo,
    isFreeShipping,
    validatePromoCode,
  };
};