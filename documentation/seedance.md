# Seedance 1.0 Pro

> Seedance 1.0 Pro, a high quality video generation model developed by Bytedance.


## Overview

- **Endpoint**: `https://fal.run/fal-ai/bytedance/seedance/v1/pro/image-to-video`
- **Model ID**: `fal-ai/bytedance/seedance/v1/pro/image-to-video`
- **Category**: image-to-video
- **Kind**: inference


## API Information

This model can be used via our HTTP API or more conveniently via our client libraries.
See the input and output schema below, as well as the usage examples.


### Input Schema

The API accepts the following input parameters:


- **`prompt`** (`string`, _required_):
  The text prompt used to generate the video
  - Examples: "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside."

- **`resolution`** (`ResolutionEnum`, _optional_):
  Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality Default value: `"1080p"`
  - Default: `"1080p"`
  - Options: `"480p"`, `"720p"`, `"1080p"`

- **`duration`** (`DurationEnum`, _optional_):
  Duration of the video in seconds Default value: `"5"`
  - Default: `"5"`
  - Options: `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`, `"10"`, `"11"`, `"12"`

- **`camera_fixed`** (`boolean`, _optional_):
  Whether to fix the camera position
  - Default: `false`

- **`seed`** (`integer`, _optional_):
  Random seed to control video generation. Use -1 for random.

- **`image_url`** (`string`, _required_):
  The URL of the image used to generate video
  - Examples: "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"



**Required Parameters Example**:

```json
{
  "prompt": "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"
}
```

**Full Example**:

```json
{
  "prompt": "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.",
  "resolution": "1080p",
  "duration": "5",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"
}
```


### Output Schema

The API returns the following output format:

- **`video`** (`File`, _required_):
  Generated video file
  - Examples: {"url":"https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v.mp4"}

- **`seed`** (`integer`, _required_):
  Seed used for generation
  - Examples: 42



**Example Response**:

```json
{
  "video": {
    "url": "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v.mp4"
  },
  "seed": 42
}
```


## Usage Examples

### cURL

```bash
curl --request POST \
  --url https://fal.run/fal-ai/bytedance/seedance/v1/pro/image-to-video \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{
     "prompt": "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.",
     "image_url": "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"
   }'
```

### Python

Ensure you have the Python client installed:

```bash
pip install fal-client
```

Then use the API client to make requests:

```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/bytedance/seedance/v1/pro/image-to-video",
    arguments={
        "prompt": "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.",
        "image_url": "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
```

### JavaScript

Ensure you have the JavaScript client installed:

```bash
npm install --save @fal-ai/client
```

Then use the API client to make requests:

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/bytedance/seedance/v1/pro/image-to-video", {
  input: {
    prompt: "A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.",
    image_url: "https://storage.googleapis.com/falserverless/example_inputs/seedance_pro_i2v_img.jpg"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```


## Additional Resources

### Documentation

- [Model Playground](https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/image-to-video)
- [API Documentation](https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/image-to-video/api)
- [OpenAPI Schema](https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/bytedance/seedance/v1/pro/image-to-video)

### fal.ai Platform

- [Platform Documentation](https://docs.fal.ai)
- [Python Client](https://docs.fal.ai/clients/python)
- [JavaScript Client](https://docs.fal.ai/clients/javascript)