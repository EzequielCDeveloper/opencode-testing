# Project Planning Questions - Gym Membership Management System

## Business & Requirements

1. **Membership Types:** What types of memberships exist? (monthly, annual, per-visit, class-based?)
   - Answer: Monthly only.
2. **Pricing:** Does each membership have different pricing? Can prices change over time?
   - Answer: Yes. One standard price and one student price.
3. **Grace Periods:** What happens when a membership expires? Is there a grace period?
   - Answer: No grace period.
4. **Freezes:** Can members pause/freeze their membership? For how long?
   - Answer: No, freeze is not supported.
5. **Referrals:** Is there a referral system or discounts for referrals?
   - Answer: Yes.

## Users & Access Control

6. **User Roles:**
   - Can employees see all clients or just assigned ones?
     - Answer: All clients.
   - Can trainers view client progress/payment history?
     - Answer: No.
   - Is there a role for billing-only staff?
     - Answer: Yes.
7. **Multi-location:** Will this support multiple gym locations?
   - Answer: Not for now.
8. **Client Self-Service:** Can clients view their own membership status online?
   - Answer: No.

## Payments

9. **Payment Methods:** Cash, card, bank transfer, online payments?
   - Answer: Cash, card, and bank transfer.
10. **Partial Payments:** Are partial payments allowed?
    - Answer: No.
11. **Refunds:** What happens with refunds? Policy?
    - Answer: No refunds.
12. **Payment History:** Do clients need receipts? Email confirmations?
    - Answer: Yes.

## Notifications

13. **Reminder Channels:** Email, SMS, WhatsApp, push notifications?
    - Answer: Email.
14. **Reminder Schedule:** When should reminders be sent? (7 days before? 3 days? Day of?)
    - Answer: 3 days before expiration.

15. **Automated vs Manual:** Are reminders automated or manually triggered?
    - Answer: Automated.

## Data & Integrations

16. **Existing Data:** Is there existing client data to migrate?
    - Answer: Yes, from paper records to digital.
17. **Integrations:** Email provider? Payment gateway? SMS service?
    - Answer: Google email provider. No payment gateway and no SMS service.
18. **Data Export:** Reports needed? PDF exports?
    - Answer: Yes, PDF reports/exports are required.
19. **Backup:** Daily backups? Retention policy?
    - Answer: Automatic daily backups are required. Retention policy is not defined yet.

## Technical & Scope

20. **Offline Mode:** Do staff need offline access?
    - Answer: No.
21. **Session Management:** How long should user sessions last?
    - Answer: One full workday, between 12 and 16 hours.
22. **Audit Trail:** Need to track who made changes to records?
    - Answer: Yes.
23. **API Access:** Will third-party services connect to your API?
    - Answer: Not for now.
24. **MVP Scope:** What's the minimum viable product vs. future features?
    - Answer: Defined in the MVP docs set.

## Constraints

25. **Timeline:** Target launch date?
    - Answer: In 2 months.
26. **Budget:** Development budget constraints?
    - Answer: Single freelance full-stack developer.
27. **Hosting:** Specific VPS requirements or preferences?
    - Answer: A self-selected VPS based on personal preference.

## Priority

- **Must-have for v1.0:**
- **Future features (v2.0+):**
