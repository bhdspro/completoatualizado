// facebook-pixel.js
const PIXEL_ID = "780872613016454"; //put your pixel id here
const CONTENTCATEGORY = "metodo";
const CONTENTNAME = "Método Destiny";

!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);

  console.info(
    "%c✅Loaded Facebook Pixel!",
    "color: lightgreen; font-family:system-ui;"
  );
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js"
);
fbq("init", PIXEL_ID);

//index.html
function enterHome() {
  fbq("track", "PageView");
  fbq("track", "productPage");
  console.info(
    "%c✅Facebook Pixel: Accessed Homepage",
    "color: lightgreen; font-family:system-ui;"
  );
}

//when entering checkout screen
function initiateCheckout() {
  fbq("track", "InitiateCheckout");
  fbq("track", "AddToCart");
  console.info(
    "%c✅Facebook Pixel: Initiated Checkout",
    "color: lightgreen; font-family:system-ui;"
  );
}

//after creating lead(filling out info on first subscribe screen)
function createLead(fullName, email, phone) {
  const firstName = fullName.substring(0, fullName.lastIndexOf(" "));
  const lastName = fullName.substring(
    fullName.lastIndexOf(" ") + 1,
    fullName.length
  );
  fbq("track", "Lead", {
    fn: firstName,
    ln: lastName,
    em: email,
    ph: phone,
  });
  //   console.log({
  //     fn: firstName,
  //     ln: lastName,
  //     em: email,
  //     ph: phone,
  //   });
  console.info(
    "%c✅Facebook Pixel: Created Lead",
    "color: lightgreen; font-family:system-ui;"
  );
}

//success
function createPurchase(
  //   contentIds,
  //   contentType,
  value
) {
  fbq("track", "AddPaymentInfo");
  fbq("track", "CompleteRegistration");
  fbq("track", "Purchase", {
    /*Parâmetros preenchidos no evento Purchase: 

    content_category = [metodo / conferencia]
    content_name = [Método Destiny / Conferência do Destino]  
    content_ids = [1 / 2]
    content = [{1 / 2}]
    content_type = product
    value = [valor total da compra]
    predicted_ltv = [valor total da compra]
    */

    content_category: CONTENTCATEGORY,
    content_name: CONTENTNAME,
    // content_ids: contentIds,
    // content: contentType,
    content_type: "product",
    value: value,
    predicted_ltv: value,
  });
  console.info(
    "%c✅Facebook Pixel: Created Purchase",
    "color: lightgreen; font-family:system-ui;"
  );
}
