<aside class="cart-sidebar" id="cartSidebar">
      <h2 class="cart-title">🛒 Aking Basket</h2>

      <div class="cart-items" id="cartItems">
        <p class="empty-cart-msg" id="emptyMsg">Wala pang laman ang basket mo! 😊</p>
      </div>

      <div class="cart-summary" id="cartSummary" style="display:none;">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span id="subtotal">&#8369;0.00</span>
        </div>
        <div class="summary-row discount-row" id="discountRow" style="display:none;">
          <span>Diskwento:</span>
          <span id="discountAmt" class="discount-text">-&#8369;0.00</span>
        </div>
        <div class="summary-row total-row">
          <span>Kabuuan:</span>
          <span id="totalPrice">&#8369;0.00</span>
        </div>

        <div class="promo-section">
          <input type="text" id="promoInput" placeholder="Promo code: DISKWENTO10" />
          <button onclick="applyPromo()">I-apply</button>
        </div>

        <button class="checkout-btn" onclick="checkout()">
          &#10003; Mag-order na!
        </button>
        <button class="clear-btn" onclick="clearCart()">
          &#128465; Alisin Lahat
        </button>
      </div>
    </aside>

  </main>
