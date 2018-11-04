# react-circular-graph

A react component to render knowledge circular rotational graph

## API

1. `selectedNode` returns selected node details
2. `selectedProjectChanged` returns a flag for selected project status

Example selected node object

```json

{
    "data" : {
      "id": "tensorflow",
      "name": "TensorFlow",
      "summary": "TensorFlow is a fast, flexible, and scalable open source machine learning library for research and production",
      "iconUrlSmall": "https://www.gstatic.com/opensource/project-images/tensorflow/logo.png?rs=AGWjSYQ1HC13sEyluXwZoYWC2w2i9qsPjQ&sqp=-oaymwEICEwQTCAAUAEIttCMygU",
      "iconUrlMedium": "https://www.gstatic.com/opensource/project-images/tensorflow/logo.png?rs=AGWjSYQ7IXg35u8B_D41kSCIRrHjJYcfng&sqp=-oaymwEKCIwBEIwBIABQAQi20IzKBQ",
      "primaryColor": "#E26026",
      "startsWith": "t",
      "fallbackColor": "#34A853",
      "RGB": {
        "r": 226,
        "g": 96,
        "b": 38
      }
    },
    ...
}

```
## Usage

`ciricular.scss`
```css

.explore-projects{
    opacity:0;
    padding:0 0 80px 0;
    transition:opacity .5s ease-out;
    position: relative;
}
.explore-projects.loaded{opacity:1}   
.error h5{margin-top:60px}   
.explore-container{position:relative}   
canvas{
    display:block;
    margin:0 auto;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}   
.selected-project{
    -webkit-animation:none;
    animation:none;
    background:hsla(0,0%,100%,0);
    border-radius:50%;
    height:340px;
    left:50%;
    margin:-170px 0 0 -170px;
    opacity:0;
    overflow:hidden;
    position:absolute;
    text-align:center;
    top:50%;
    width:340px
}   
.selected-project a{opacity:0}   
.selected-project.active,    
.selected-project.active a {
    -webkit-animation:fade-in .4s ease-in-out forwards;
    animation:fade-in .4s ease-in-out forwards;
    cursor:pointer
}   
.selected-project .project-summary{height:260px}   
.selected-project .project-summary img{width : 60px;height:60px}   
.selected-project a,.selected-project h5,.selected-project p{margin:0 15px 15px 15px}   
.selected-project .icon{max-height:60px}
.selected-project img{margin:30px auto 0 auto}
.selected-project p{font-size:14px;line-height:18px;max-height:145px;overflow:hidden}   
.page{
    -webkit-animation:fade-in 2s ease-in-out 1s forwards;
    animation:fade-in 2s ease-in-out 1s forwards;
    // background:url(/assets/images/chevron-dark.svg) 0 0 no-repeat;
    cursor:pointer;
    height:15px;
    left:10px;
    margin:-15px 0 0 0;
    opacity:0;
    overflow:hidden;
    position:absolute;
    text-indent:-9999px;
    top:50%;
    -webkit-transform:rotate(90deg);
    transform:rotate(90deg);
    -webkit-transform-origin:center;
    transform-origin:center;
    transition:-webkit-transform .1s ease-in;
    transition:transform .1s ease-in;
    transition:transform .1s ease-in,-webkit-transform .1s ease-in;
    width:20px
}  
.page.next{left:auto;right:10px;-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}   
.page:hover{-webkit-transform:rotate(90deg) scale(1.4);transform:rotate(90deg) scale(1.4)}   
.page.next:hover{
  -webkit-transform:rotate(-90deg) scale(1.4);transform:rotate(-90deg) scale(1.4)
}
@-webkit-keyframes fade-in{
    0%{opacity:0}
    50%{opacity:0}
    to{opacity:1}
}
@keyframes fade-in{
    0%{opacity:0}
    50%{opacity:0}
    to{opacity:1}
}

```


```javascript

import React,{ Fragment } from 'react';
import { connect } from "react-redux";
import ReactCircularGraph from 'react-circular-graph';
import './circular.scss'

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
      "id": "tensorflow",
      "name": "TensorFlow",
      "summary": "TensorFlow is a fast, flexible, and scalable open source machine learning library for research and production",
      "iconUrlSmall": "https://www.gstatic.com/opensource/project-images/tensorflow/logo.png?rs=AGWjSYQ1HC13sEyluXwZoYWC2w2i9qsPjQ&sqp=-oaymwEICEwQTCAAUAEIttCMygU",
      "iconUrlMedium": "https://www.gstatic.com/opensource/project-images/tensorflow/logo.png?rs=AGWjSYQ7IXg35u8B_D41kSCIRrHjJYcfng&sqp=-oaymwEKCIwBEIwBIABQAQi20IzKBQ",
      "primaryColor": "#E26026",
      "startsWith": "t",
      "fallbackColor": "#34A853",
      "RGB": {
        "r": 226,
        "g": 96,
        "b": 38
      }
    },
  ]

class CircularData extends Component{
  state = {
    show:true
  }
  render(){
    if (this.props.canvas){
      return(
        <div className={this.props.selectedProjectChanged ? 'selected-project active' : "selected-project unactive"}>
          <div className="project-summary">
            <img src={`${this.props.canvas.iconUrlMedium}`} alt="logo" />
            <h5>{this.props.canvas.name}</h5>
            <p>{this.props.canvas.summary}</p>
          </div>
          <a className="text-btn" href={`${this.props.canvas.projecturl}`}>
              View Project
          </a>
        </div>
      )
    }else{
      return null
    }
  }
}
function mapStateToProps(state) {
  return {
    canvas: state.Canvas && state.Canvas.data,
    selectedProjectChanged: state.Canvas && state.Canvas.isProjectChanged
  }
}

export default connect(mapStateToProps, null)(Circular);

React.render(
    <Fragment>
        <ReactCircularGraph
            width={720}
            height={720}
            data = {data}
            config = {config}
            selectedNode = {(node)=>console.log(node)}
        />
        <CircularData />
    </Fragment>, document.body);
    
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
