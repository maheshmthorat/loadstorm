# LoadStorm

LoadStorm is a powerful command-line interface (CLI) tool crafted to stress-test web pages by executing concurrent requests. It empowers developers and QA teams to evaluate website performance under heavy loads, pinpointing potential bottlenecks and ensuring optimal user experience.

[![npm version](https://img.shields.io/badge/npm-v1.0.18-blue?logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/loadstorm)
[![github](https://img.shields.io/badge/-Repository-black?logo=github)](https://github.com/maheshmthorat/loadstorm)
[![install size](https://img.shields.io/badge/install%20size-17%20kB-green?logo=files&logoColor=white)](https://www.npmjs.com/package/loadstorm)
[![author](https://img.shields.io/badge/author-Mahesh%20Thorat-purple)](https://maheshthorat.web.app/)

## Description

LoadStorm is designed to simulate high traffic scenarios on websites, allowing users to measure response times, evaluate performance metrics, and analyze system details under load conditions.

## Features

- **Concurrent Requests**: Simulate multiple requests to a website concurrently.
- **Performance Metrics**: Measure response times and provide performance statistics.
- **Customizable**: Configure the number of requests and the level of concurrency.
- **Internet Speed**: Measure download speed during testing.
- **System Details**: Display host information, operating system, CPU model, and memory.

## Installation

You can run it directly using npx:

```bash
npx loadstorm --site=https://your-domain.com --requests=20 --concurrency=5 --detailed-log=true
```

## Usage

LoadStorm can be run from the command line with various options.

```cmd
npx loadstorm --site=https://your-domain.com --requests=20 --concurrency=5 --detailed-log=true
```

### Options

#### `--site` (required): The URL of the site to test.

```bash
--site=https://your-domain.com
```

#### `--requests` (required): The number of requests to generate.

```bash
--requests=50
```

#### `--concurrency` (required): The number of concurrent requests to make.

```bash
--concurrency=10
```

#### `--detailed-log` (optional): Enable detailed logging of request times. Default is `false`.

```bash
--detailed-log=true
```

#### `--headers` (optional): Custom headers in JSON format for the requests.

```bash
--headers='{\"Authorization\":\"Bearer token\"}'
```

#### `--method` (optional): HTTP method for the requests. Default is `GET`.

```bash
--method=POST
```

#### `--payload` (optional): Payload data for POST, PUT, and DELETE requests.

```bash
--payload='{\"key\":\"value\"}'
```

## Example Command

```cmd
npx loadstorm --site=https://your-domain.com/api --requests=50 --concurrency=10 --headers="{\"Authorization\":\"Bearer token\"}" --method=POST --payload="{\"key\":\"value\"}"
```

## Example Output

```plaintext
Welcome to LoadStorm! Starting load testing...
Running 20 requests with a concurrency level of 5...
Progress: 100.00%
Load test completed successfully!

📊 REPORT
─────────────────────────┬──────────────────────────────────────────────────────
 Metric                │ Value
─────────────────────────┼──────────────────────────────────────────────────────
 URL                   │ https://work.life
 Number of Requests    │ 10
 Concurrency Level     │ 10
 Start Time            │ 26/6/2024, 2:57:30 pm
 End Time              │ 26/6/2024, 2:57:32 pm
 Total Time            │ 2.63 seconds
 Average Response Time │ 1.90 seconds
 90th Percentile       │ 2023 ms
 95th Percentile       │ 2040 ms
 99th Percentile       │ 2071 ms
─────────────────────────┼──────────────────────────────────────────────────────
 Internet Speed        │ Download Speed: 13.58 Mbps
─────────────────────────┼──────────────────────────────────────────────────────
 System Details        | Hostname: Mahesh
                       | Operating System: Windows_NT 10.0.22631
                       | CPU Model: 12th Gen Intel(R) Core(TM) i3-12100
                       | Memory: 7.72 GB
─────────────────────────┴──────────────────────────────────────────────────────
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or enhancements.

## License

[MIT](LICENSE)

## Author

Mahesh Thorat

#### If you find LoadStorm useful, consider donating: https://pages.razorpay.com/maheshmthorat
