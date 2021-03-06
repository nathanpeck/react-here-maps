// a "normal" marker that uses a static image as an icon.
// large numbers of markers of this type can be added to the map
// very quickly and efficiently

import getDomMarkerIcon from "./utils/get-dom-marker-icon";
import getMarkerIcon from "./utils/get-marker-icon";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

// declare an interface containing the required and potential
// props that can be passed to the HEREMap Marker component
export interface MarkerProps extends H.map.Marker.Options, H.geo.IPoint {
    bitmap?: string;
}

// declare an interface containing the potential state flags
interface MarkerState {

}

// declare an interface containing the potential context parameters
interface MarkerContext {
    map: H.Map;
}

// export the Marker React component from this module
export class Marker extends React.Component<MarkerProps, MarkerState> {
    // define the context types that are passed down from a <HEREMap> instance
    public static contextTypes = {
        map: React.PropTypes.object,
    };

    public context: MarkerContext;

    public render(): JSX.Element {
        const { map } = this.context;

        if (map) {
            this.addMarkerToMap();
        }

        return null;
    }

    private addMarkerToMap() {
        const {
            map,
        } = this.context;

        const {
            children,
            bitmap,
            lat,
            lng,
        } = this.props;

        if (React.Children.count(children) > 0) {
            // if children are provided, we render the provided react
            // code to an html string
            const html = ReactDOMServer.renderToStaticMarkup(
                <div className="dom-marker">
                    { children }
                </div>
            );

            // we then get a dom icon object from the wrapper method
            const icon = getDomMarkerIcon(html);

            // then create a dom marker instance and attach it to the map,
            // provided via context
            const marker = new H.map.DomMarker({ lat, lng }, { icon });
            map.addObject(marker);
        } else if (bitmap) {
            // if we have an image url and no react children, create a
            // regular icon instance
            const icon = getMarkerIcon(bitmap);

            // then create a normal marker instance and attach it to the map
            const marker = new H.map.Marker({ lat, lng }, { icon });
            map.addObject(marker);
        } else {
            // create a default marker at the provided location
            const marker = new H.map.Marker({ lat, lng });
            map.addObject(marker);
        }
    }
}

// make the Marker component the default export
export default Marker;
