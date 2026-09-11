/*
Module with helpers for displaying UI messages.
*/

import { messageContainer } from '../types';

const BASE_URL = import.meta.env.BASE_URL;

// -- Messages --


// Set message text in search results
export function setMessageText(
  message: string,
  type: "normal" | "danger" = "normal",
) {
  if (!messageContainer) return;

  // Replace any previous message
  messageContainer.textContent = message;

  // Update styling
  messageContainer.className = "search-message";

  // If "danger", update class
  if (type === "danger") {
    messageContainer.classList.add("has-text-danger");
  }

  messageContainer.classList.remove("is-hidden");
}

// Clear message text in search results
export function clearMessageText() {
  if (!messageContainer) return;

  messageContainer.textContent = "";
  messageContainer.className = "search-message is-hidden";
}

