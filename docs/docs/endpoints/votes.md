# Retrieve Vote Status

```http
GET /bots/123456789012345678/votes/123456789012345678
Authorization: YOUR_API_KEY
```

Returns 200 OK if the user has voted for the bot, 404 Not Found if the user has not voted for the bot.

## Request
### Path Parameters
- `id` - The ID of the bot.
- `user_id` - The ID of the user.

## Response
### Success
- `200 OK` - The user has voted for the bot.
- `404 Not Found` - The user has not voted for the bot.

### Error
- `401 Unauthorized` - API key is missing or invalid.