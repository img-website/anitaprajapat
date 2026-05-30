"use client";

import { useEffect, useRef } from "react";
// `...WithUtils` bundles the formatting/validation utils so getNumber() returns
// a clean international (E.164) number.
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import "intl-tel-input/styles";

/**
 * Phone input with a searchable country dropdown (flags + dial codes), powered
 * by intl-tel-input. Reports the full international number via onChange.
 */
export default function PhoneField({ value = "", onChange, required, id = "phone" }) {
  const inputRef = useRef(null);
  const itiRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep the latest onChange without re-initialising intl-tel-input.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const iti = intlTelInput(el, {
      initialCountry: "in",
      countrySearch: true,
      separateDialCode: true,
      countryOrder: ["in", "us", "gb", "ae", "au", "ca"],
    });
    itiRef.current = iti;

    const emit = () => onChangeRef.current?.(iti.getNumber() || el.value || "");
    el.addEventListener("input", emit);
    el.addEventListener("countrychange", emit);

    return () => {
      el.removeEventListener("input", emit);
      el.removeEventListener("countrychange", emit);
      iti.destroy();
    };
  }, []);

  // Reset the field when the parent clears the form (e.g. after submit).
  useEffect(() => {
    if (value === "" && inputRef.current && inputRef.current.value !== "") {
      inputRef.current.value = "";
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="tel"
      name="phone"
      autoComplete="tel"
      required={required}
      placeholder="98765 43210"
    />
  );
}
