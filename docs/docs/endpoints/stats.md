# Update Bot Stats

```http
PATCH /bots/123456789012345678/stats
Authorization: YOUR_API_KEY
```

Returns 200 OK if the bot stats were successfully updated.

## Request
### Path Parameters
- `id` - The ID of the bot.

### Body Parameters
- `server_count` - The number of servers the bot is in.
- `command_count` - The number of commands the bot has.

## Response
### Success
- `200 OK` - The bot stats were successfully updated.

### Error
- `401 Unauthorized` - API key is missing or invalid.

### Example Body
```json
{
  "server_count": 0,
  "command_count": 0
}
```