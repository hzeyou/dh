import { NodeView } from "hzero-front-apaas/lib/components/AntvX6";
export class SimpleNodeView extends NodeView {
  renderMarkup() {
    return this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body'
    });
  }
  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6'
      }
    });
  }
}