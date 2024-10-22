---
name: 'Optimizing Authentication in discord.place'
description: "We switched from sessions to JWTs at discord.place to improve performance and security. Learn why and how."
id: optimizing-authentication-in-discord-place
tags:
  - 'discord.place'
  - 'authentication'
date: 1728525612755
---

In the ever-evolving world of web development, striking the balance between functionality and efficiency is crucial. At discord.place, we recently migrated our authentication system from a session-based approach using Express Passport to a JSON Web Token (JWT) based system. This change was driven by the need to streamline data storage and enhance scalability for our growing user base.

This blog post delves into the key differences between session-based and JWT-based authentication, highlighting the factors that led to our decision in the discord.place.

## Session-Based Authentication vs. JWT-Based Authentication

**Session-Based Authentication:**

- **Function:** Relies on server-side storage of user data (session data) associated with a unique identifier (session ID) typically stored in a cookie.
- **Pros:**
    1. Simple to implement.
    2. Well-suited for short-lived interactions.
- **Cons:**
    1. Server load increases with growing user sessions.
    2. Scalability limitations for large user bases.
    3. Potential security risks with session data stored on the server.

**JWT-Based Authentication:**

- **Function:** Utilizes self-contained tokens (JWTs) containing user information signed with a secret key. These tokens are sent with each request for authentication.
- **Pros:**
    1. Reduced server load as user data is not stored on the server.
    2. Enhanced scalability for large user bases.
    3. Potential for improved security due to stateless nature.
- **Cons:**
    1. Requires additional development effort for token management.
    2. Increased complexity for handling revoked tokens.

## Why We Migrated to JWTs at discord.place

With a growing user base on discord.place, the sheer volume of session data stored on the server became a scalability concern. Additionally, managing session data posed a potential security risk. Transitioning to a JWT-based system addressed these challenges by:

- **Reducing Server Load:** By eliminating the need to store session data on the server, JWTs significantly reduced the strain on our database.
- **Enhancing Scalability:** The stateless nature of JWTs allows us to scale our infrastructure more efficiently as our user base grows.

## Conclusion

The migration to a JWT-based authentication system at discord.place exemplifies the importance of adapting to changing needs. By leveraging JWTs, we optimized data storage, enhanced scalability, and potentially improved security. While both session-based and JWT-based authentication have their merits, choosing the right approach depends on your specific project requirements.