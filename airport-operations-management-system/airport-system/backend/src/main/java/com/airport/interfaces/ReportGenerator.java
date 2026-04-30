package com.airport.interfaces;

import java.util.Map;

/**
 * ReportGenerator — Interface defining the reporting contract.
 *
 * OOP - INTERFACE:
 *   All report modules (OperationalReport, GateReport, RunwayReport, BeltReport)
 *   must implement this interface, ensuring a consistent API surface.
 */
public interface ReportGenerator {

    /**
     * Generate and return the report as a key-value map.
     * Keys are metric names; values are the corresponding data.
     */
    Map<String, Object> generateReport();

    /**
     * Returns the title/name of this report type.
     */
    String getReportTitle();

    /**
     * Returns the time range covered by this report.
     */
    String getReportPeriod();
}
