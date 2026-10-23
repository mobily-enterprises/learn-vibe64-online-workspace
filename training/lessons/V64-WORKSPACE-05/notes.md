# Good to know: Your own domain

## Subdomains are easiest

A subdomain such as `shop.example.com` can point at your app with a CNAME
record. A bare domain such as `example.com` often can't have a CNAME; your
domain provider may offer an ALIAS or "flattened" record instead.

## Certificates

Once the domain is verified and points at your app, Vibe64 gets its secure
certificate by itself the first time someone visits. The first visit can take
a few extra seconds.

## Help

Colleague can read your domain's state with you and explain what is still
missing. Changing DNS at your provider is always your own step.
