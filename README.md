# react-circular-graph

A react component to render knowlege circular rotational graph

## API

`selectedNode` returns selected node details

Example selected node object

```json

{
    data : {
      RGB: {r: 251, g: 188, b: 5},
      fallbackColor: "#FBBC05",
      id: "fontdiff",
      name: "FontDiff",
      small: true,
      startsWith: "f",
      summary: "A tool for finding visual differences between font versions",
    }
    ...
}

```
## Usage

```javascript

import ReactCircularGraph from 'react-circular-graph';

var config = {
    "ENABLE_ERROR_REPORTING": true,
    "LIST_PAGE_SIZE": 48,
    "EXPLORE_PAGE_SIZE": 80,
    "MOBILE_WIDTH": 720,
    "COLORS": {
      "GREEN": "#34A853",
      "RED": "#EA4335",
      "BLUE": "#4285F4",
      "YELLOW": "#FBBC05"
    }
}

var data = [
    {
      "id": "science-journal-arduino",
      "name": "science-journal-arduino",
      "summary": "Science Journal Arduino Firmware",
      "startsWith": "s",
      "fallbackColor": "#EA4335",
      "RGB": {
        "r": 234,
        "g": 67,
        "b": 53
      }
    },
  ]

React.render(
    <ReactCircularGraph
        width={720}
        height={720}
        data = {data}
        config = {config}
        selectedNode = {(node)=>console.log(node)}
    />, document.body);
    
```


### Screenshot

![Preview][screenshot]

[screenshot]: https://github.com/Anishmprasad/circular-knowledge-graph/raw/master/src/public/images/screenshot.png "Preview screenshot"


## Built With

* [React](https://https://reactjs.org/) - A JavaScript library

## Author

- Anish M Prasad (anishmprasad@gmail.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Anishmprasad/circular-knowledge-graph/blob/master/README.md) file for details

**In the words of Martin Luther King Junior:**
> Hate cannot drive out hate; only love can do that.