import * as React from 'react';

export interface UploadImageDispatchProps {
    imageChanged?: (File: {}) => void;
    clearImage?: () => void;
}

export interface UploadImageStateProps {
}

export type UploadImageProps = UploadImageDispatchProps & UploadImageStateProps;

export default class UploadImageComponent extends React.Component<UploadImageProps, {}> {
    constructor(props: UploadImageDispatchProps) {
        super(props);

        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleImageChange(e: any): void {
        e.preventDefault();
        if (this.props && this.props.imageChanged) {
            let file = e.target.files[0];
            this.props.imageChanged(file);
        }
    }

    componentWillUnmount(): void {
        if (this.props.clearImage) {
            this.props.clearImage();
        }
    }

    render(): JSX.Element {
        return (
            <div className="image-upload">
                <label htmlFor="file-input-image">
                    {this.props.children}
                </label>
                <input
                    id="file-input-image"
                    type="file"
                    onChange={this.handleImageChange}
                    accept="image/*"
                    className="hide"
                />
            </div>
        );
    }
}