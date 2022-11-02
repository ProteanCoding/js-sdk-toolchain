## API Report File for "@dcl/react-ecs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="@dcl/posix" />

// Warning: (ae-missing-release-tag) "CANVAS_ROOT_ENTITY" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const CANVAS_ROOT_ENTITY = 7;

// Warning: (ae-missing-release-tag) "Children" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type Children = any;

// Warning: (ae-missing-release-tag) "Color3" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Color3 {
    // (undocumented)
    b: number;
    // (undocumented)
    g: number;
    // (undocumented)
    r: number;
}

// Warning: (ae-missing-release-tag) "Color4" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Color4 {
    // (undocumented)
    a: number;
    // (undocumented)
    b: number;
    // (undocumented)
    g: number;
    // (undocumented)
    r: number;
}

// Warning: (ae-missing-release-tag) "CommonProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type CommonProps = {
    key: Key;
    children: Children;
};

// Warning: (ae-missing-release-tag) "Container" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function Container({ width, height, children }: ContainerPropTypes): ReactEcs.JSX.Element;

// Warning: (ae-missing-release-tag) "ContainerPropTypes" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type ContainerPropTypes = Partial<CommonProps> & EntityPropTypes['uiTransform'];

// Warning: (ae-missing-release-tag) "EcsElements" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type EcsElements = {
    entity: Partial<Omit<EntityComponents, 'onClick'> & CommonProps>;
};

// Warning: (ae-missing-release-tag) "EntityComponents" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type EntityComponents = {
    uiTransform: PBUiTransform;
    uiText: PBUiText;
    uiBackground: PBUiBackground;
    onClick: OnClick;
};

// @public (undocumented)
export type EntityPropTypes = {
    uiTransform?: UiTransformProps;
    uiText?: UiTextProps;
    uiBackground?: UiBackgroundProps;
};

// Warning: (ae-missing-release-tag) "Font" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum Font {
    // (undocumented)
    F_LIBERATION_SANS = 0,
    // (undocumented)
    F_SANS_SERIF = 1,
    // (undocumented)
    UNRECOGNIZED = -1
}

// Warning: (ae-missing-release-tag) "isListener" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const isListener: (key: string) => key is "onClick";

// Warning: (ae-missing-release-tag) "JSX" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export namespace JSX {
    // (undocumented)
    export interface Component {
    }
    // (undocumented)
    export interface Element {
    }
    // (undocumented)
    export type IntrinsicElements = EcsElements;
}

// Warning: (ae-missing-release-tag) "Key" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type Key = number | string;

// Warning: (ae-missing-release-tag) "Listeners" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type Listeners = {
    onClick?: OnClick;
};

// Warning: (ae-forgotten-export) The symbol "EventsSystem" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "OnClick" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type OnClick = EventsSystem.Callback;

// Warning: (ae-missing-release-tag) "PBUiBackground" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface PBUiBackground {
    backgroundColor?: Color4 | undefined;
}

// Warning: (ae-missing-release-tag) "PBUiText" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface PBUiText {
    color?: Color3 | undefined;
    font?: Font | undefined;
    fontSize?: number | undefined;
    textAlign?: TextAlignMode | undefined;
    // (undocumented)
    value: string;
}

// Warning: (ae-missing-release-tag) "PBUiTransform" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface PBUiTransform {
    // (undocumented)
    alignContent: YGAlign;
    // (undocumented)
    alignItems: YGAlign;
    // (undocumented)
    alignSelf: YGAlign;
    // (undocumented)
    borderBottom: number;
    // (undocumented)
    borderLeft: number;
    // (undocumented)
    borderRight: number;
    // (undocumented)
    borderTop: number;
    // (undocumented)
    direction: YGDirection;
    // (undocumented)
    display: YGDisplay;
    // (undocumented)
    flex: number;
    // (undocumented)
    flexBasis: number;
    // (undocumented)
    flexBasisUnit: YGUnit;
    // (undocumented)
    flexDirection: YGFlexDirection;
    // (undocumented)
    flexGrow: number;
    // (undocumented)
    flexShrink: number;
    // (undocumented)
    flexWrap: YGWrap;
    // (undocumented)
    height: number;
    // (undocumented)
    heightUnit: YGUnit;
    // (undocumented)
    justifyContent: YGJustify;
    // (undocumented)
    marginBottom: number;
    // (undocumented)
    marginBottomUnit: YGUnit;
    // (undocumented)
    marginLeft: number;
    marginLeftUnit: YGUnit;
    // (undocumented)
    marginRight: number;
    // (undocumented)
    marginRightUnit: YGUnit;
    // (undocumented)
    marginTop: number;
    // (undocumented)
    marginTopUnit: YGUnit;
    // (undocumented)
    maxHeight: number;
    // (undocumented)
    maxHeightUnit: YGUnit;
    // (undocumented)
    maxWidth: number;
    // (undocumented)
    maxWidthUnit: YGUnit;
    // (undocumented)
    minHeight: number;
    // (undocumented)
    minHeightUnit: YGUnit;
    // (undocumented)
    minWidth: number;
    // (undocumented)
    minWidthUnit: YGUnit;
    // (undocumented)
    overflow: YGOverflow;
    // (undocumented)
    paddingBottom: number;
    // (undocumented)
    paddingBottomUnit: YGUnit;
    // (undocumented)
    paddingLeft: number;
    // (undocumented)
    paddingLeftUnit: YGUnit;
    // (undocumented)
    paddingRight: number;
    // (undocumented)
    paddingRightUnit: YGUnit;
    // (undocumented)
    paddingTop: number;
    // (undocumented)
    paddingTopUnit: YGUnit;
    // (undocumented)
    parent: number;
    // (undocumented)
    positionBottom: number;
    // (undocumented)
    positionBottomUnit: YGUnit;
    // (undocumented)
    positionLeft: number;
    // (undocumented)
    positionLeftUnit: YGUnit;
    // (undocumented)
    positionRight: number;
    // (undocumented)
    positionRightUnit: YGUnit;
    // (undocumented)
    positionTop: number;
    // (undocumented)
    positionTopUnit: YGUnit;
    // (undocumented)
    positionType: YGPositionType;
    // (undocumented)
    rightOf: number;
    // (undocumented)
    width: number;
    // (undocumented)
    widthUnit: YGUnit;
}

// @public (undocumented)
export type Position = {
    top: PositionUnit;
    right: PositionUnit;
    bottom: PositionUnit;
    left: PositionUnit;
};

// Warning: (ae-missing-release-tag) "PositionUnit" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type PositionUnit = `${number}px` | `${number}%` | number;

// Warning: (ae-missing-release-tag) "ReactEcs" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
namespace ReactEcs {
    // (undocumented)
    namespace JSX {
        // (undocumented)
        interface Component {
        }
        // (undocumented)
        interface Element {
        }
        // (undocumented)
        type IntrinsicElements = EcsElements;
    }
    const // (undocumented)
    createElement: any;
}
export { ReactEcs }
export default ReactEcs;

// Warning: (ae-missing-release-tag) "removeUi" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function removeUi(index: number): void;

// Warning: (ae-missing-release-tag) "renderUi" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export function renderUi(ui: UiComponent): number;

// Warning: (ae-missing-release-tag) "TextAlignMode" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum TextAlignMode {
    // (undocumented)
    TAM_BOTTOM_CENTER = 7,
    // (undocumented)
    TAM_BOTTOM_LEFT = 6,
    // (undocumented)
    TAM_BOTTOM_RIGHT = 8,
    // (undocumented)
    TAM_MIDDLE_CENTER = 4,
    // (undocumented)
    TAM_MIDDLE_LEFT = 3,
    // (undocumented)
    TAM_MIDDLE_RIGHT = 5,
    // (undocumented)
    TAM_TOP_CENTER = 1,
    // (undocumented)
    TAM_TOP_LEFT = 0,
    // (undocumented)
    TAM_TOP_RIGHT = 2,
    // (undocumented)
    UNRECOGNIZED = -1
}

// Warning: (ae-missing-release-tag) "UiBackgroundProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type UiBackgroundProps = PBUiBackground;

// Warning: (ae-missing-release-tag) "UiComponent" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type UiComponent = () => JSX.Element;

// @public (undocumented)
export function UiEntity(props: EntityPropTypes & Partial<CommonProps>): ReactEcs.JSX.Element;

// Warning: (ae-missing-release-tag) "UiTextProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export type UiTextProps = PBUiText;

// @public (undocumented)
export interface UiTransformProps {
    // (undocumented)
    alignContent?: YGAlign;
    // (undocumented)
    alignItems?: YGAlign;
    // (undocumented)
    alignSelf?: YGAlign;
    // (undocumented)
    direction?: YGDirection;
    // (undocumented)
    display?: YGDisplay;
    // (undocumented)
    flex?: number;
    // (undocumented)
    flexBasis?: number;
    // (undocumented)
    flexDirection?: YGFlexDirection;
    // (undocumented)
    flexGrow?: number;
    // (undocumented)
    flexShrink?: number;
    // (undocumented)
    flexWrap?: YGWrap;
    // (undocumented)
    height?: PositionUnit;
    // (undocumented)
    justifyContent?: YGJustify;
    // (undocumented)
    margin?: Partial<Position>;
    // (undocumented)
    maxHeight?: PositionUnit;
    // (undocumented)
    maxWidth?: PositionUnit;
    // (undocumented)
    minHeight?: PositionUnit;
    // (undocumented)
    minWidth?: PositionUnit;
    // (undocumented)
    overflow?: YGOverflow;
    // (undocumented)
    padding?: Partial<Position>;
    // (undocumented)
    position?: Partial<Position>;
    // (undocumented)
    positionType?: YGPositionType;
    // (undocumented)
    width?: PositionUnit;
}

// Warning: (ae-missing-release-tag) "YGAlign" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGAlign {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGA_AUTO = 0,
    // (undocumented)
    YGA_BASELINE = 5,
    // (undocumented)
    YGA_CENTER = 2,
    // (undocumented)
    YGA_FLEX_END = 3,
    // (undocumented)
    YGA_FLEX_START = 1,
    // (undocumented)
    YGA_SPACE_AROUND = 7,
    // (undocumented)
    YGA_SPACE_BETWEEN = 6,
    // (undocumented)
    YGA_STRETCH = 4
}

// Warning: (ae-missing-release-tag) "YGDirection" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGDirection {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGD_INHERIT = 0,
    // (undocumented)
    YGD_LTR = 1,
    // (undocumented)
    YGD_RTL = 2
}

// Warning: (ae-missing-release-tag) "YGDisplay" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGDisplay {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGD_FLEX = 0,
    // (undocumented)
    YGD_NONE = 1
}

// Warning: (ae-missing-release-tag) "YGFlexDirection" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGFlexDirection {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGFD_COLUMN = 0,
    // (undocumented)
    YGFD_COLUMN_REVERSE = 1,
    // (undocumented)
    YGFD_ROW = 2,
    // (undocumented)
    YGFD_ROW_REVERSE = 3
}

// Warning: (ae-missing-release-tag) "YGJustify" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGJustify {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGJ_CENTER = 1,
    // (undocumented)
    YGJ_FLEX_END = 2,
    // (undocumented)
    YGJ_FLEX_START = 0,
    // (undocumented)
    YGJ_SPACE_AROUND = 4,
    // (undocumented)
    YGJ_SPACE_BETWEEN = 3,
    // (undocumented)
    YGJ_SPACE_EVENLY = 5
}

// Warning: (ae-missing-release-tag) "YGOverflow" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGOverflow {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGO_HIDDEN = 1,
    // (undocumented)
    YGO_SCROLL = 2,
    // (undocumented)
    YGO_VISIBLE = 0
}

// Warning: (ae-missing-release-tag) "YGPositionType" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGPositionType {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGPT_ABSOLUTE = 2,
    // (undocumented)
    YGPT_RELATIVE = 1,
    // (undocumented)
    YGPT_STATIC = 0
}

// Warning: (ae-missing-release-tag) "YGUnit" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGUnit {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGU_AUTO = 3,
    // (undocumented)
    YGU_PERCENT = 2,
    // (undocumented)
    YGU_POINT = 1,
    // (undocumented)
    YGU_UNDEFINED = 0
}

// Warning: (ae-missing-release-tag) "YGWrap" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export enum YGWrap {
    // (undocumented)
    UNRECOGNIZED = -1,
    // (undocumented)
    YGW_NO_WRAP = 0,
    // (undocumented)
    YGW_WRAP = 1,
    // (undocumented)
    YGW_WRAP_REVERSE = 2
}

// (No @packageDocumentation comment for this package)

```