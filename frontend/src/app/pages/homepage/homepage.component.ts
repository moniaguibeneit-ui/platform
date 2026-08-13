import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="homepage-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Discover Authentic Perfumes from Trusted Merchants</h1>
          <p class="hero-subtitle">Your trusted destination for genuine fragrances from verified sellers</p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" class="hero-btn" (click)="navigateToStore()">
              <mat-icon>store</mat-icon>
              Browse Stores
            </button>
            <button mat-stroked-button class="hero-btn" (click)="learnMore()">
              <mat-icon>info</mat-icon>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="trust-section">
        <div class="section-container">
          <h2 class="section-title">Why Trust PerfumeMarket?</h2>
          <div class="trust-cards">
            <mat-card class="trust-card">
              <div class="trust-icon">
                <mat-icon>verified_user</mat-icon>
              </div>
              <h3>Verified Merchants</h3>
              <p>All merchants are manually verified to ensure authenticity and quality</p>
            </mat-card>
            <mat-card class="trust-card">
              <div class="trust-icon">
                <mat-icon>security</mat-icon>
              </div>
              <h3>Secure Platform</h3>
              <p>Order safely with our secure checkout and order tracking system</p>
            </mat-card>
            <mat-card class="trust-card">
              <div class="trust-icon">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <h3>Cash on Delivery</h3>
              <p>Pay when you receive your order - no upfront payment required</p>
            </mat-card>
            <mat-card class="trust-card">
              <div class="trust-icon">
                <mat-icon>support_agent</mat-icon>
              </div>
              <h3>Dedicated Support</h3>
              <p>Our team is here to help with any questions or concerns</p>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works">
        <div class="section-container">
          <h2 class="section-title">How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Find a Store</h3>
                <p>Browse our verified merchants and discover their collections</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Choose Products</h3>
                <p>Select your favorite perfumes and add them to cart</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Place Order</h3>
                <p>Checkout with cash on delivery - pay when you receive</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>Track Delivery</h3>
                <p>Monitor your order status until it arrives at your door</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Merchant Selection -->
      <section class="merchant-section">
        <div class="section-container">
          <h2 class="section-title">How We Select Merchants</h2>
          <div class="merchant-info">
            <div class="info-card">
              <mat-icon>check_circle</mat-icon>
              <h3>Manual Verification</h3>
              <p>Every merchant is personally verified by our team to ensure they meet our quality standards</p>
            </div>
            <div class="info-card">
              <mat-icon>workspace_premium</mat-icon>
              <h3>Quality Products</h3>
              <p>Merchants must demonstrate they sell authentic, high-quality perfumes</p>
            </div>
            <div class="info-card">
              <mat-icon>star</mat-icon>
              <h3>Customer Service</h3>
              <p>Selected merchants are committed to excellent customer service</p>
            </div>
            <div class="info-card">
              <mat-icon>history</mat-icon>
              <h3>Proven Track Record</h3>
              <p>We partner with merchants who have established reputations in the industry</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="about-section">
        <div class="section-container">
          <div class="about-content">
            <div class="about-text">
              <h2 class="section-title">About PerfumeMarket</h2>
              <p>PerfumeMarket was created to solve a common problem: finding authentic perfumes from trusted sellers in a market flooded with counterfeits. We bridge the gap between customers and verified perfume merchants, providing a secure platform for genuine fragrance shopping.</p>
              <p>Our mission is to create a trusted ecosystem where customers can shop with confidence and merchants can grow their businesses with verified, quality-focused customers.</p>
              <div class="about-actions">
                <button mat-raised-button color="primary" (click)="learnMore()">
                  Learn More About Us
                </button>
              </div>
            </div>
            <div class="about-image">
              <mat-icon class="about-icon">perfume</mat-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <div class="section-container">
          <h2 class="section-title">Get in Touch</h2>
          <div class="contact-info">
            <div class="contact-item">
              <mat-icon>email</mat-icon>
              <div>
                <h3>Email Us</h3>
                <p>support@perfumemarket.com</p>
              </div>
            </div>
            <div class="contact-item">
              <mat-icon>phone</mat-icon>
              <div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="contact-item">
              <mat-icon>location_on</mat-icon>
              <div>
                <h3>Visit Us</h3>
                <p>123 Fragrance Lane, Perfume City</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="section-container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>PerfumeMarket</h3>
              <p>Your trusted platform for authentic perfumes from verified merchants</p>
            </div>
            <div class="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a (click)="navigateToStore()">Browse Stores</a></li>
                <li><a (click)="learnMore()">About Us</a></li>
                <li><a (click)="learnMore()">How It Works</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a (click)="learnMore()">Privacy Policy</a></li>
                <li><a (click)="learnMore()">Terms & Conditions</a></li>
                <li><a (click)="learnMore()">Merchant Guidelines</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h3>Connect</h3>
              <div class="social-links">
                <a href="#"><mat-icon>facebook</mat-icon></a>
                <a href="#"><mat-icon>camera_alt</mat-icon></a>
                <a href="#"><mat-icon>chat</mat-icon></a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 PerfumeMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .homepage-container {
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, var(--mat-sys-primary-container), var(--mat-sys-secondary-container));
      padding: 80px 20px;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: var(--mat-sys-on-primary-container);
    }

    .hero-subtitle {
      font-size: 20px;
      margin: 0 0 32px 0;
      color: var(--mat-sys-on-primary-container);
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .hero-btn {
      height: 48px;
      padding: 0 24px;
      font-size: 16px;
      font-weight: 600;
    }

    .section-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    .section-title {
      text-align: center;
      font-size: 36px;
      font-weight: 600;
      margin: 0 0 40px 0;
    }

    .trust-section {
      background: white;
    }

    .trust-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .trust-card {
      text-align: center;
      padding: 32px;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .trust-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .trust-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .trust-card h3 {
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .trust-card p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .how-it-works {
      background: var(--mat-sys-surface-container-low);
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .step {
      display: flex;
      gap: 16px;
    }

    .step-number {
      width: 48px;
      height: 48px;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-content h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .step-content p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .merchant-section {
      background: white;
    }

    .merchant-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .info-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
    }

    .info-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-primary);
      margin-bottom: 16px;
    }

    .info-card h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .info-card p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .about-section {
      background: var(--mat-sys-surface-container-low);
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    .about-text h2 {
      margin: 0 0 24px 0;
    }

    .about-text p {
      margin: 0 0 16px 0;
      line-height: 1.6;
      color: var(--mat-sys-on-surface-variant);
    }

    .about-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .about-icon {
      font-size: 200px;
      width: 200px;
      height: 200px;
      color: var(--mat-sys-primary);
      opacity: 0.2;
    }

    .contact-section {
      background: white;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
    }

    .contact-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-primary);
    }

    .contact-item h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .contact-item p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .footer {
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      padding: 48px 20px 24px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      margin-bottom: 32px;
    }

    .footer-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .footer-section p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section li {
      margin-bottom: 8px;
    }

    .footer-section a {
      color: var(--mat-sys-on-surface-variant);
      text-decoration: none;
      cursor: pointer;
    }

    .footer-section a:hover {
      color: var(--mat-sys-primary);
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-links a {
      width: 40px;
      height: 40px;
      background: var(--mat-sys-surface-container);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--mat-sys-on-surface);
    }

    .social-links a:hover {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
    }

    .footer-bottom {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid rgba(0,0,0,0.1);
    }

    .footer-bottom p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }

      .hero-actions {
        flex-direction: column;
      }

      .section-container {
        padding: 40px 16px;
      }

      .section-title {
        font-size: 28px;
      }

      .trust-cards,
      .merchant-info,
      .contact-info {
        grid-template-columns: 1fr;
      }

      .about-content {
        grid-template-columns: 1fr;
      }

      .about-icon {
        font-size: 120px;
        width: 120px;
        height: 120px;
      }

      .footer-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomepageComponent {
  private router = inject(Router);

  navigateToStore(): void {
    // Will navigate to products once routing is set up
    console.log('Navigate to store');
  }

  learnMore(): void {
    // Navigate to about page (to be implemented)
    console.log('Learn more clicked');
  }
}
