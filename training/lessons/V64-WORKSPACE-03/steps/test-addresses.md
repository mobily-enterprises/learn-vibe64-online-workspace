Staging never acts for real. An app published there sends email only to the
**Test email address** and SMS only to the **Test phone number** on the
**Test addresses** card, logging each one instead while its field is empty.
Payments go to the payment provider's sandbox. The workspace owner fills in
the two fields to see what the app sends.

You don't need to change anything now: the sign sends nothing.

```beats
show deploy-staging-test-addresses: Staging sends email and SMS only to these test addresses, and logs them while they are empty.
```
