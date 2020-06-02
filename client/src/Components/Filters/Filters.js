import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './Filters.scss';
import { TextField, Checkbox } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { VariableSizeList } from 'react-window';
import { useTheme, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const Filters = forwardRef((props, ref) => {
    // Hide show filters for mobile
    const [showFilters, setShowFilters] = useState(false);
    const [canSendFilters, setCanSendFilters] = useState(false);

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
        setCategories(value);
    };
    
    const handleIngredients = (event, value) => {
        setIngredients(value);
    };

    const handleGlasses = (event, value) => {
        setGlasses(value);
    };

    const handleAlcoholicFilters = (event, value) => {
        setAlcoholicFilters(value);
    };

    var canSendFilter = false;
    useEffect((test) => {
        // Don't send filters on load
        if (!canSendFilters) {
            setCanSendFilters(true);
            return;
        }

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
        handleShowFilters() {
            setShowFilters(!showFilters);
        }
    }));

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
    const ListboxComponent = React.forwardRef(function ListboxComponent(
      props,
      ref
    ) {
      const { children, ...other } = props;
      const itemData = React.Children.toArray(children);
      const theme = useTheme();
      const itemCount = itemData.length;
      const itemSize = 50;
    
      const getChildSize = child => {
        return itemSize;
      };
    
      const getHeight = () => {
        if (itemCount > 8) {
          return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
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
              itemSize={index => getChildSize(itemData[index])}
              overscanCount={5}
              itemCount={itemCount}
            >
              {renderRow}
            </VariableSizeList>
          </OuterElementContext.Provider>
        </div>
      );
    });
    
    ListboxComponent.propTypes = {
      children: PropTypes.node
    };

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
    }
    

    return (
        // Content
        <div id="filters" className={showFilters ? "show" : "hide"}>
            <h1>Filters</h1>
            <div className="filter">
                <TextField onChange={handleSearch} value={search} label="Search" variant="outlined" />
            </div>
            <div className="filter">
                {RenderAutocomplete(handleCategories, categories, props.data.categories, "Categories")}
            </div>
            <div className="filter">
                {RenderLongAutocomplete(handleIngredients, ingredients, props.data.ingredients, "Ingredients")}
            </div>
            <div className="filter">
                {RenderAutocomplete(handleGlasses, glasses, props.data.glasses, "Glasses")}
            </div>
            <div className="filter">
                {RenderAutocomplete(handleAlcoholicFilters, alcoholicFilters, props.data.alcoholicFilters, "Alcohol Content")}
            </div>
        </div>
    );
});

export default Filters;