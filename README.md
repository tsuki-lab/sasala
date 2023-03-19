# Sasala - Discord Assistant

<img src="https://user-images.githubusercontent.com/48175599/226177021-ab167aed-60f2-4a52-8625-a0dbf992e0c2.png" width="250px" style="border-radius: 10px;" />

## Features

- [x] Feed - 事前に登録してある RSS フィードを定期的にチェックし、更新があった場合に通知を送信します。
- [ ] Youtube - お気に入りの Youtube チャンネルの動画を定期的にチェックし、更新があった場合に通知を送信します。
- [ ] Communication - チャットボットとしての機能を提供します。

## Deployment

**Vercel でデプロイする場合は、以下の環境変数を設定してください。**

| Name                    | Value                                           |
| ----------------------- | ----------------------------------------------- |
| API_KEY                 | このアプリケーションの API キー（任意の文字列） |
| DISCORD_WEBHOOK_URL     | Discord の Webhook URL                          |
| MICROCMS_API_KEY        | MicroCMS の API キー                            |
| MICROCMS_SERVICE_DOMAIN | MicroCMS のサービスドメイン                     |

**GitHub でデプロイする場合は、以下の環境変数を設定してください。**

| Name           | Value                                           |
| -------------- | ----------------------------------------------- |
| API_KEY        | このアプリケーションの API キー（任意の文字列） |
| SERVICE_DOMAIN | このアプリケーションのサービスドメイン          |

## License

MIT
