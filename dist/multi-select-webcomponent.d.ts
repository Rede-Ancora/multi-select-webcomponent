export default class MultiselectWebcomponent extends HTMLElement {
    options: HTMLOptionElement[];
    searchbox: HTMLInputElement;
    dropdown: HTMLDivElement;
    selected: HTMLDivElement;
    buttons: HTMLDivElement;
    constructor();
    set value(value: string[]);
    private setValuesOnConstructor;
    get value(): string[];
    set disabled(value: boolean);
    get disabled(): boolean;
    set placeholder(value: string);
    get placeholder(): string;
    clear(): void;
    build(): void;
    private buildSelectedItem;
    private buildDropdownItem;
    private buildClearButton;
    private buildSelectAllButton;
    private findOptionByValue;
    private chooseOption;
    private onItemClick;
    private onSelectedClick;
    private onClearClick;
    private onSelectAllClick;
    private onMultiselectClick;
    private onDropdownClick;
    private onSearchboxKeyup;
}
