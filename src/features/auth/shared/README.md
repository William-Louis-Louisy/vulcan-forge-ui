# Shared authentication UI

This directory contains deterministic, provider-independent authentication presentation helpers used by login, signup and password recovery.

It must not own password hashing, compromised-password checks, credential verification, rate limiting or session policy. Those decisions remain server-side.
