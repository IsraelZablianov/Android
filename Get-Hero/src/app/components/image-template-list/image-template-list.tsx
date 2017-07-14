import * as React from "react";
import UploadImageComponent from "../upload-image/upload-image";
import { imageTemplates } from "./image-templates";

export interface ImageTemplateListProps {
    imageChanged?: (File: {}) => void;
}

export interface ImageTemplateListState {

}

export default class ImageTemplateList extends React.Component<ImageTemplateListProps, ImageTemplateListState> {

    // private extenssion: string = ".png";
    // a download={imageTemplate.className + this.extenssion} href={imageTemplate.url} title={imageTemplate.className}

    constructor(props: ImageTemplateListProps) {
        super(props);
    }

    render(): JSX.Element {
        imageTemplates
        return (
            <div>
                {imageTemplates.map((imageTemplate, index) => {
                    return (
                        <div className="image-templates">
                            <UploadImageComponent imageChanged={(file) => { }}>
                                <img className={imageTemplate.className} src={imageTemplate.url} key={index} />
                            </UploadImageComponent>
                        </div>
                    );
                })}
            </div>
        );
    }

    onTemplateSelected(file: any): void {
        if (this.props.imageChanged) {
            this.props.imageChanged(file)
        }
    }
}