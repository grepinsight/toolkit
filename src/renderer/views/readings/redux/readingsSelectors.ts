import isUrl from "is-url";
import { createSelector } from "reselect";
import { RootState } from "../../../states/rootState";
import { normalizeString } from "../../../utils/stringUtils";

export const selectReadings = (state: RootState) => state.readings;
export const selectReadingsInputValue = (state: RootState) => state.readings.inputValue;
export const selectReadingsFilter = (state: RootState) => state.readings.filter;
export const selectReadingsReadings = (state: RootState) => state.readings.readings;
export const selectReadingsActive = (state: RootState) => state.readings.active;

export const selectFilteredReadings = createSelector(
  selectReadingsReadings,
  selectReadingsFilter,
  selectReadingsInputValue,
  (readings, filter, inputValue) => {
    let filteredReadings = readings;

    if (filter !== "ALL") {
      filteredReadings = filteredReadings.filter(r => r.status === filter);
    }

    if (inputValue.trim().length > 0 && !isUrl(inputValue)) {
      const normInputValue = normalizeString(inputValue);
      filteredReadings = filteredReadings.filter(r => {
        return (
          `${normalizeString(r.title)} ${normalizeString(r.description ?? "")} ${normalizeString(
            r.value
          )}`.indexOf(normInputValue) > -1
        );
      });
    }

    return filteredReadings;
  }
);
