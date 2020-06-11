import React, { useState, useEffect, useImperativeHandle, forwardRef, memo } from 'react';
import './Filters.scss';
import { TextField, Checkbox, Dialog, DialogTitle, InputLabel, Select, FormControl, OutlinedInput, Button, IconButton } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { VariableSizeList } from 'react-window';
import { makeStyles } from "@material-ui/core/styles";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

const Filters = forwardRef((props, ref) => {
    // hide show dialog
    const [open, setOpen] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [glasses, setGlasses] = useState([]);
    const [alcoholicFilters, setAlcoholicFilters] = useState([]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleCategories = (event, value) => {
        if (value === undefined) {
           value = getValueFromEvent(event);
        } 
        setCategories(value);
    };
    
    const handleIngredients = (event, value) => {
        if (value === undefined) {
            value = getValueFromEvent(event);
        }
        setIngredients(value);
    };

    const handleGlasses = (event, value) => {
        if (value === undefined) {
            value = getValueFromEvent(event);
        }
        setGlasses(value);
    };

    const handleAlcoholicFilters = (event, value) => {
        if (value === undefined) {
            value = getValueFromEvent(event);
        }
        setAlcoholicFilters(value);
    };

    function getValueFromEvent(event) {
        var value = [];
        const { options } = event.target;
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        return value;
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleClearFilters = () => {
        setSearch("");
        setCategories([]);
        setIngredients([]);
        setGlasses([]);
        setAlcoholicFilters([]);
    }

    const handleFullScreen = () => {
        if (isMobile) {
            return true;
        } else {
            return false;
        }s
    }

    useEffect(() => {
        // Prep filters
        const filters = {
            search: search,
            categories: categories,
            ingredients: ingredients,
            glasses: glasses,
            alcoholicFilters: alcoholicFilters
        };
        props.sendFilters(filters);
             
    }, [search, categories, ingredients, glasses, alcoholicFilters]);


    useImperativeHandle(ref, () => ({
        open() {
            setOpen(true);
        }
    }));

    const RenderNativeSelect = (onChange, value, options, label) => {
        return (
            <FormControl variant="outlined">
                <InputLabel shrink htmlFor={"outlined-native-"+label}>{label}</InputLabel>
                <Select
                    native
                    value={value}
                    onChange={onChange}
                    multiple
                    label={label}
                    input={
                        <OutlinedInput
                            notched
                            labelWidth={(label.length*7) + 10}
                            name={label}
                            id={"outlined-native-"+label}
                        />
                    }
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
          </FormControl>
        )
    }

    const renderCheckBox = (option, selected) => {
        return (
            <React.Fragment>
                <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ 
                        marginRight: 8 
                    }}
                    checked={selected}
                    color="primary"
                />
                {option}
            </React.Fragment>
        );
    };

    const RenderAutocomplete = (onChange, value, options, label) => {
        return (
            <Autocomplete
                onChange={onChange}
                value={value}
                multiple
                options={options}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(option, { selected }) => ( renderCheckBox(option, selected) )}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label={label} placeholder="" />
                )}
            />
        );
    };

    // For long autocomplete with react-window
    // ____________________________________________________________________
    const LISTBOX_PADDING = 8; // px

    function renderRow(props) {
      const { data, index, style } = props;
      return React.cloneElement(data[index], {
        style: {
          ...style,
          top: style.top + LISTBOX_PADDING
        }
      });
    }
    
    const OuterElementContext = React.createContext({});
    
    const OuterElementType = React.forwardRef((props, ref) => {
      const outerProps = React.useContext(OuterElementContext);
      return <div ref={ref} {...props} {...outerProps} />;
    });
    
    function useResetCache(data) {
        const ref = React.useRef(null);
            React.useEffect(() => {
            if (ref.current != null) {
                ref.current.resetAfterIndex(0, true);
            }
            }, [data]);
        return ref;
    }
    
    // Adapter for react-window
    const ListboxComponent = React.forwardRef((props, ref) => {
        const { children, ...other } = props;
        const itemData = React.Children.toArray(children);
        const itemCount = itemData.length;
        const itemSize = 50;

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(itemSize).reduce((a, b) => a + b, 0);
        };

        const gridRef = useResetCache(itemCount);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={itemSize}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    });

    const RenderLongAutocomplete = (onChange, value, options, label) => {
        const classes = makeStyles({
            listbox: {
                boxSizing: "border-box",
                "& ul": {
                padding: 0,
                margin: 0
                }
            }
        })();
    
        return (
            <Autocomplete
                onChange={onChange}
                value={value}
                disableListWrap
                disableCloseOnSelect
                multiple
                openOnFocus
                classes={classes}
                ListboxComponent={ListboxComponent}
                options={options}
                renderInput={params => (
                <TextField {...params} variant="outlined" label={label} />
                )}
                renderOption={(option, { selected }) => ( renderCheckBox(option, selected) )}
            />
        );
    };
    // ____________________________________________________________________

    return (
        // Content
        <Dialog fullScreen={handleFullScreen()} onClose={handleClose} open={open}>
            <div id="filters">
                <IconButton className="closeIcon" onClick={() => {setOpen(false)}}>
                    <Close fontSize="inherit"/>
                </IconButton>
                <DialogTitle id="simple-dialog-title">Filters</DialogTitle>
                <div className="filter">
                    <TextField onChange={handleSearch} value={search} label="Search" variant="outlined" />
                </div>
                <div className="filter">
                    <MobileView>
                        {RenderNativeSelect(handleCategories, categories, props.data.categories, "Categories")}
                    </MobileView>
                    <BrowserView>
                        {RenderAutocomplete(handleCategories, categories, props.data.categories, "Categories")}
                    </BrowserView>
                </div>
                <div className="filter">
                    <MobileView>
                        {RenderNativeSelect(handleIngredients, ingredients, props.data.ingredients, "Ingredients")}
                    </MobileView>
                    <BrowserView>
                        {RenderLongAutocomplete(handleIngredients, ingredients, props.data.ingredients, "Ingredients")}
                    </BrowserView>
                </div>
                <div className="filter">
                    <MobileView>
                        {RenderNativeSelect(handleGlasses, glasses, props.data.glasses, "Glasses")}
                    </MobileView>
                    <BrowserView>
                        {RenderAutocomplete(handleGlasses, glasses, props.data.glasses, "Glasses")}
                    </BrowserView>
                </div>
                <div className="filter">
                    <MobileView>
                        {RenderNativeSelect(handleAlcoholicFilters, alcoholicFilters, props.data.alcoholicFilters, "Alcohol Content")}
                    </MobileView>
                    <BrowserView>
                        {RenderAutocomplete(handleAlcoholicFilters, alcoholicFilters, props.data.alcoholicFilters, "Alcohol Content")}
                    </BrowserView>
                </div>
                <div className="filter">
                    <Button variant="contained" color="secondary" size="small" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </div>
        </Dialog>
    );
});

export default memo(Filters);