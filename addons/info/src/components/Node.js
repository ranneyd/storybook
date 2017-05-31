import React from 'react';
import Props from './Props';

const stylesheet = {
  containerStyle: {},
  tagStyle: {
    color: '#777',
  },
};

export default class Node extends React.Component {
  render() {
    const {
      node,
      depth,
      maxPropsIntoLine,
      maxPropObjectKeys,
      maxPropArrayLength,
      maxPropStringLength,
    } = this.props;
    const { tagStyle, containerStyle } = stylesheet;

    const leftPad = {
      paddingLeft: 3 + (depth + 1) * 15,
      paddingRight: 3,
    };

    Object.assign(containerStyle, leftPad);

    const { name, text, children } = getData(node);

    // Just text
    if (!name) {
      return (
        <div style={containerStyle}>
          <span style={tagStyle}>{text}</span>
        </div>
      );
    }

    // Single-line tag
    if (!children) {
      return (
        <div style={containerStyle}>
          <span style={tagStyle}>&lt;{name}</span>
          <Props
            node={node}
            singleLine
            maxPropsIntoLine={maxPropsIntoLine}
            maxPropObjectKeys={maxPropObjectKeys}
            maxPropArrayLength={maxPropArrayLength}
            maxPropStringLength={maxPropStringLength}
          />
          <span style={tagStyle}>/&gt;</span>
        </div>
      );
    }

    // Keep a copy so that further mutations to containerStyle don't impact us:
    const containerStyleCopy = Object.assign({}, containerStyle);

    // tag with children
    return (
      <div>
        <div style={containerStyleCopy}>
          <span style={tagStyle}>&lt;{name}</span>
          <Props
            node={node}
            maxPropsIntoLine={maxPropsIntoLine}
            maxPropObjectKeys={maxPropObjectKeys}
            maxPropArrayLength={maxPropArrayLength}
            maxPropStringLength={maxPropStringLength}
          />
          <span style={tagStyle}>&gt;</span>
        </div>
        {React.Children.map(children, childElement => (
          <Node
            node={childElement}
            depth={depth + 1}
            maxPropsIntoLine={maxPropsIntoLine}
            maxPropObjectKeys={maxPropObjectKeys}
            maxPropArrayLength={maxPropArrayLength}
            maxPropStringLength={maxPropStringLength}
          />
        ))}
        <div style={containerStyleCopy}>
          <span style={tagStyle}>&lt;/{name}&gt;</span>
        </div>
      </div>
    );
  }
}

function getData(element) {
  const data = {
    name: null,
    text: null,
    children: null,
  };

  if (typeof element === 'null') {
    return data;
  }

  if (typeof element == 'string') {
    data.text = element;
    return data;
  }

  if (typeof element === 'number') {
    data.text = String.toString(element);
    return data;
  }

  data.children = element.props.children;
  const type = element.type;

  if (typeof type === 'string') {
    data.name = type;
  } else {
    data.name = type.displayName || type.name || 'Unknown';
  }

  return data;
}