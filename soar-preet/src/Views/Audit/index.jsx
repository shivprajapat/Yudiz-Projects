import React, { useEffect, useRef, useState } from "react";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import Navbar from "Components/Navbar";
import ChartContainer from "Components/ChartContainer";
import ReactApexChart from "react-apexcharts";
import {
  AuditDashboardSystemSummaryOptions,
  AuditDashboardAuditTrailOptions,
  PolicyInfringementOption,
  AuditDashboardSystemConnectivityOptions,
  AuditDashboardMediaUsageSummaryOptions,
  AuditDashboardFileTypeSummaryOptions,
  inventorySummaryChartOption,
  scoreIndicatorOption,
  scoreIndicatorSeries,
  scoreIndicatorValue,
} from "Constants/ChartOptions";
import {
  chartId,
  chartNames,
  chartTitles,
  dashboardTitle,
} from "Helper/constant";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "Redux/Actions/BreadCrumbAction";
import SystemConnectivityDetail from "Components/SystemConnectivityDetail";
import SystemSummaryDetail from "Components/SystemSummaryDetail";

const AuditDashboard = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [toggleChart, setToggleChart] = useState("dataLeakage");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isSelected, setIsSelected] = useState("");

  const breadCrumb = useSelector((state) => state.breadcrumb);

  useEffect(() => {
    if (shouldScroll) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
      setShouldScroll(false);
    }
  }, [shouldScroll, breadCrumb]);

  function handleRadialBarChart(systemConnectivity) {
    setIsSelected(chartNames.radialBar);
    setShouldScroll(true);
    if (breadCrumb.length === 0) {
      const breadcrumbItem = {
        label: systemConnectivity,
        path: chartId.systemConnectivity,
      };
      dispatch(setBreadcrumb(breadcrumbItem));
    }
  }

  function handlePieChart(systemSummary) {
    setIsSelected(chartNames.pie);
    setShouldScroll(true);

    const breadcrumbItem = {
      label: systemSummary,
      path: chartId.systemSummary,
    };
    dispatch(setBreadcrumb(breadcrumbItem));
  }

  function handlePolarChart(auditTrail) {
    setIsSelected(chartNames.polarArea);
    setShouldScroll(true);

    const breadcrumbItem = {
      label: auditTrail,
      path: chartId.auditTrail,
    };
    dispatch(setBreadcrumb(breadcrumbItem));
  }
  return (
    <>
      <Box
        component="div"
        className="mx-6 mt-5 mb-10"
        sx={{
          "& .apexcharts-canvas": {
            marginInline: "auto",
          },
        }}
      >
        <Navbar title={dashboardTitle.audit} />

        <Grid
          container
          className={`bg-lightBlue text-grey w-[100%] min-h-[108px] mb-[15px] d-flex justify-between`}
        >
          <Grid
            item
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[250px] !my-[22px]"
            >
              <div className="text-[32px]">1200</div>
              <div className="text-[14px]">Total Systems</div>
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[10px] !my-[22px]"
            >
              <Divider
                orientation="vertical"
                style={{
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  height: "51px",
                }}
              />
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[250px] !my-[22px]"
            >
              <div className="text-[32px]">1000</div>
              <div className="text-[14px]">Monitoring Systems</div>
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[10px] !my-[22px]"
            >
              <Divider
                orientation="vertical"
                style={{
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  height: "51px",
                }}
              />
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[250px] !my-[22px]"
            >
              <div className="text-[32px]">750</div>
              <div className="text-[14px]">Up Systems</div>
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[10px] !my-[22px]"
            >
              <Divider
                orientation="vertical"
                style={{
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  height: "51px",
                }}
              />
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[250px] !my-[22px]"
            >
              <div className="text-[32px]">250</div>
              <div className="text-[14px]">Down Systems</div>
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[10px] !my-[22px]"
            >
              <Divider
                orientation="vertical"
                style={{
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  height: "51px",
                }}
              />
            </Grid>
            <Grid
              item
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              className="min-w-[250px] !my-[22px]"
            >
              <div className="text-[32px]">200</div>
              <div className="text-[14px]">Not Linked Systems</div>
            </Grid>
          </Grid>
          <Grid
            item
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            flexDirection="column"
          >
            <ReactApexChart
              options={scoreIndicatorOption}
              series={scoreIndicatorSeries}
              type="radialBar"
            />
            <div
              className="needle"
              style={{
                transform: `rotate(${
                  scoreIndicatorValue * 1.8 - 90
                }deg) translateX(-50%)`,
                top: "45px",
              }}
            />
            <div style={{ position: "inherit", top: "-15px", fontWeight: "bold" }}>
              {scoreIndicatorValue}
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="cursor-pointer">
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={3}
            className={`${
              isSelected && isSelected !== chartNames.radialBar
                ? "opacity-[0.3] pointer-events-none cursor-not-allowed"
                : ""
            } cursor-pointer`}
          >
            <ChartContainer firstTitle={chartTitles.systemConnectivity}>
              <ReactApexChart
                options={AuditDashboardSystemConnectivityOptions}
                series={AuditDashboardSystemConnectivityOptions.series}
                type="radialBar"
                onClick={handleRadialBarChart}
              />
              <BottomNavigation
                showLabels
                className="absolute inset-x-0 bottom-0"
              >
                <BottomNavigationAction
                  label="Linked Equipment"
                  style={{ background: "#EC726E" }}
                  className="font-bold text-sm"
                />
                <BottomNavigationAction
                  label="Present Not Linked"
                  style={{ background: "#68C2DF" }}
                  className="font-bold text-sm"
                />
                <BottomNavigationAction
                  label="Not Monitoring Device"
                  style={{ background: "#F0B05D" }}
                  className="font-bold text-sm"
                />
              </BottomNavigation>
            </ChartContainer>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={3}
            className={`${
              isSelected && isSelected && isSelected !== chartNames.pie
                ? "opacity-[0.3] pointer-events-none "
                : ""
            } cursor-pointer`}
          >
            <ChartContainer firstTitle={chartTitles.systemSummary}>
              <ReactApexChart
                options={AuditDashboardSystemSummaryOptions}
                series={AuditDashboardSystemSummaryOptions.series}
                type="pie"
                onClick={handlePieChart}
              />
            </ChartContainer>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className={`${
              isSelected && isSelected && isSelected !== chartNames.inventory
                ? "opacity-[0.3] pointer-events-none "
                : ""
            } cursor-pointer`}
          >
            <ChartContainer firstTitle={chartTitles.inventorySummary}>
              <ReactApexChart
                options={inventorySummaryChartOption}
                series={inventorySummaryChartOption.series}
                type="bar"
              />
            </ChartContainer>
          </Grid>

          {breadCrumb.some((i) => i.path === chartId.systemConnectivity) && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={12}
              className="flex content-center items-center py-8"
              ref={scrollRef}
            >
              <SystemConnectivityDetail setIsSelected={setIsSelected} />
            </Grid>
          )}

          {breadCrumb.some((i) => i.path === chartId.systemSummary) && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={12}
              className="flex content-center items-center py-8"
              ref={scrollRef}
            >
              <SystemSummaryDetail setIsSelected={setIsSelected} />
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={4}
            className={`${
              isSelected && isSelected && isSelected !== chartNames.polarArea
                ? "opacity-[0.3] pointer-events-none "
                : ""
            } cursor-pointer`}
          >
            <ChartContainer
              firstTitle={chartTitles.auditTrail}
            >
              <ReactApexChart
                options={AuditDashboardAuditTrailOptions}
                series={AuditDashboardAuditTrailOptions.series}
                type="polarArea"
                onClick={handlePolarChart}
              />
            </ChartContainer>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={8}
            className={`${
              isSelected && isSelected && isSelected !== chartNames.policy
                ? "opacity-[0.3] pointer-events-none "
                : ""
            } cursor-pointer`}
          >
            <div
              className={`bg-lightBlue  w-full h-full   relative transition-all duration-500 scale-100`}
            >
              <div className="relative p-2.5 mb-2.5 bg-darkGrey flex  justify-between">
                <h3 className="leading-[16.8px] m-0 text-grey text-l font-bold">
                  {toggleChart === "policy"
                    ? "Policy Infringement"
                    : "Data Leakage"}
                </h3>
                <div className="flex">
                  <div
                    className={`${
                      toggleChart === "policy" ? "bg-[#363E58]" : ""
                    }  text-grey  hover:text-white  px-2  border border-black hover:border-transparent `}
                    onClick={() => setToggleChart("policy")}
                  >
                    Policy
                  </div>
                  <div
                    className={`${
                      toggleChart === "dataLeakage" ? "bg-[#363E58]" : ""
                    }  text-grey  hover:text-white  px-2  border border-black hover:border-transparent `}
                    onClick={() => setToggleChart("dataLeakage")}
                  >
                    Data Leakage
                  </div>
                </div>
              </div>
              {toggleChart === "dataLeakage" && (
                <div className="flex">
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <ReactApexChart
                      options={AuditDashboardMediaUsageSummaryOptions}
                      series={AuditDashboardMediaUsageSummaryOptions.series}
                      type="bar"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <ReactApexChart
                      options={AuditDashboardFileTypeSummaryOptions}
                      series={AuditDashboardFileTypeSummaryOptions.series}
                      type="bar"
                    />
                  </Grid>
                </div>
              )}
              {toggleChart === "policy" && (
                <ReactApexChart
                  options={PolicyInfringementOption}
                  series={PolicyInfringementOption.series}
                  type="bar"
                />
              )}
            </div>
          </Grid>

          {breadCrumb.some((i) => i.path === chartId.auditTrail) && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={12}
              className="flex content-center items-center py-8"
              ref={scrollRef}
            >
              <SystemSummaryDetail setIsSelected={setIsSelected} />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default AuditDashboard;
