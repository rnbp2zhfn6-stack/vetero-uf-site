/* Central configuration for VeteRo.
   TODO-FYLL-I: add stock, shipping, payments, pickup and seasonal delivery details when confirmed. */
(function () {
  "use strict";
  const config = Object.freeze({
    brand: "VeteRo",
    email: "vetero.uf@gmail.com",
    price: 249,
    currencyLabel: "kr",
    size: "15 × 60 cm",
    stockStatus: null, // TODO-FYLL-I
    shippingPrice: null, // TODO-FYLL-I
    shippingTime: null, // TODO-FYLL-I
    paymentMethods: [], // TODO-FYLL-I
    pickupDetails: null, // TODO-FYLL-I
    responseTime: null, // TODO-FYLL-I
    christmasOrderDeadline: null // TODO-FYLL-I
  });
  window.VETERO_CONFIG = config;

  document.querySelectorAll('[data-config="price"]').forEach(node => {
    node.textContent = config.price + " " + config.currencyLabel;
  });
  document.querySelectorAll('[data-config="size"]').forEach(node => {
    node.textContent = config.size;
  });
  const productSchema = document.querySelector("#product-jsonld");
  if (productSchema) {
    try {
      const schema = JSON.parse(productSchema.textContent);
      schema["@graph"]?.forEach(item => {
        if (item["@type"] === "Product" && item.offers) item.offers.price = String(config.price);
      });
      productSchema.textContent = JSON.stringify(schema);
    } catch (error) {
      console.warn("Kunde inte uppdatera produktens strukturerade data.", error);
    }
  }

  document.querySelectorAll("[data-order-link]").forEach(link => {
    const priceLabel = config.price + " " + config.currencyLabel;
    const subject = encodeURIComponent("Köpförfrågan – VeteRo (" + priceLabel + ")");
    const body = encodeURIComponent("Hej!\n\nJag vill göra en köpförfrågan för VeteRo (" + priceLabel + ").\n\nKan ni återkomma med totalpris inklusive eventuell frakt, betalningssätt och beräknad leverans? Jag bekräftar köpet först när jag fått informationen.\n\nHälsningar");
    link.href = "mailto:" + config.email + "?subject=" + subject + "&body=" + body;
  });

  async function copyEmail(button) {
    const status = button.parentElement?.querySelector("[data-copy-status]") || button.nextElementSibling;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(config.email);
      } else {
        const field = document.createElement("textarea");
        field.value = config.email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Kunde inte kopiera");
      }
      if (status) status.textContent = "E-postadressen är kopierad.";
    } catch (error) {
      if (status) status.textContent = "Kopiera adressen manuellt: " + config.email;
    }
  }
  document.querySelectorAll("[data-copy-email]").forEach(button => {
    button.addEventListener("click", () => copyEmail(button));
  });
})();