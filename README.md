# Lambda Console

☁️🐚 A CLI to run shell commands or interact with your application on Lambda. This includes typical shell commands like `cat /etc/os-release` or language-specific interactions directly with your running application like Ruby's IRB prompt or Rails console.

![Lambda Console CLI Screenshot](./images/lambda-console-cli-dark.png#gh-dark-mode-only)
![Lambda Console CLI Screenshot](./images/lambda-console-cli-light.png#gh-light-mode-only)

The Lambda Console is language agnostic and its [event specification](#specfication) can be implemented in any language. See our list of [supporting implementation](#implementations) for details.

## ⬇️ Installation

```shell
npm install -g lambda-console-cli
```

## 🐚 Usage

Assuming your language or application framework has a [supporting implementation](#implementations) and that you have an AWS CLI user or profile configured with the [required permissions](#permissions), simply invoke `lambda-console-cli` binary.

As seen in the screenshot above, it will present a series of interactive prompts to configure the AWS SDKs needed to invoke your Lambda function with the console [event specification](#specfication). All interactive prompts have CLI options.

```
> lambda-console-cli --help
Usage: lambda-console [options]

A CLI to run shell commands or interact with your application on Lambda.

Options:
  -v, --version                 Output the current version
  -r, --region <string>         AWS Region name
  -p, --profile <string>        AWS Profile name
  -f, --function-name <string>  AWS Lambda Function Name
  -h, --help                    display help for command
```

## 🏘️ Implementations

Have you created a language-specific package or implemented the Lambda Console specification in your framework? Open an GitHub issue and [share your project](https://github.com/rails-lambda/lambda-console/issues/new/choose) with us. We will add it to this list below.

- Ruby: The [lambda-console-ruby](https://github.com/rails-lambda/lambda-console-ruby) gem for any Ruby Lambda.
- Rails: Integrated into the [Lamby](https://github.com/rails-lambda/lamby) v5 for Rails on Lambda.

## 📐 Specification 

Please see [Lambda Console (Ruby)](https://github.com/rails-lambda/lambda-console-ruby) for a full reference implementation of the Lambda Console spec in Ruby. 

### Event Structure

The event structure for Lambda Console language specific implementation must conform to the following JSON schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "X_LAMBDA_CONSOLE": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "run": {
              "type": "string"
            }
          },
          "required": ["run"],
          "additionalProperties": false
        },
        {
          "properties": {
            "interact": {
              "type": "string"
            }
          },
          "required": ["interact"],
          "additionalProperties": false
        }
      ]
    }
  },
  "required": ["X_LAMBDA_CONSOLE"]
}

```

More succinctly, one of the two examples are acceptable event types.

**Run Commands**: For running shell commands.

```json
{ "X_LAMBDA_CONSOLE": { "run": "cat /etc/os-release" } }
```

**Interact Commands**: Interact in the context of your program. Like IRB for Ruby.

```json
{ "X_LAMBDA_CONSOLE": { "interact": "User.find(1)" } }
```

### Response Formats

These rules apply to any implementation Lambda response for the Lambda Console to work properly.

**Run Commands**

- `statusCode`: Either `0` if no error or `1` if an error occurred.
- `body`: Combined string of standard out and error in the order they happened.

**Interact Commands**

- `statusCode`: Either `200` if no error or `422` if an error occurred.
- `body`: String response of the expression evaluated by your program.

### Recommendations

- Run: Should assume the Lambda task/application root as the present working directory.
- Run: Should capture standard out and error in a single stream.
- Interactive: Should be run from a language's main context or binding.

## Future Ideas

- Should our interact command capture all stdout or just the return of the evaluated expression?
- Can we leverage some pseudo-tty features for run commands to support features like ANSI colors?
- Creating a more formal response JSON schema as we create more features coupled to that response.
- Add response headers so implementations can signal a language being used for code highlighting.
- Can we stream STDOUT and STDERR back to the client as it happens? Lambda Streaming?

## Permissions

The user running this CLI will need the following IAM actions associated with their user or role:

- `lambda:ListFunctions`
- `lambda:InvokeFunction`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/rails-lambda/lambda-console. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/rails-lambda/lambda-console/blob/main/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Lambda Console project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/rails-lambda/lambda-console/blob/main/CODE_OF_CONDUCT.md).
