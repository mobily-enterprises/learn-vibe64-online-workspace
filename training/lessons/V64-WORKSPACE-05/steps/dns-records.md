Under your domain, Vibe64 shows the record that proves it is yours: a **TXT**
record whose name starts with `_vibe64.` and whose value starts with
`vibe64-domain=`.

At your domain provider, add:

1. that **TXT** record, exactly as shown;
2. a **CNAME** record for your domain whose value is your app's Vibe64
   address (the link under **Production**), so visitors reach the app.

DNS changes can take from a few minutes to a few hours to be seen.

```beats
show deploy-address: The record to add at your domain provider is shown under your domain.
```
