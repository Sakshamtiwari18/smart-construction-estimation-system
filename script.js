// ============================================================
// SMART CONSTRUCTION ESTIMATION SYSTEM
// WEB CALCULATION ENGINE
// ============================================================

// ============================================================
// CONVERSION FACTORS
// ============================================================

const FT2_TO_M2 = 0.092903;
const FT3_TO_M3 = 0.0283168;


// ============================================================
// PWD / SOR / REFERENCE RATES
// ============================================================

const BRICK_RATE_1000 = 6900.00;
const CEMENT_RATE_BAG = 330.00;
const FINE_SAND_RATE_M3 = 1300.00;

const RCC_RATE_M3 = 9500.00;
const FOOTING_RATE_M3 = 8800.00;

const PLASTER_RATE_M2 = 175.00;
const FLOORING_RATE_M2 = 310.00;
const PAINTING_RATE_M2 = 68.00;

const MASON_RATE_DAY = 500.00;
const MAZDOOR_RATE_DAY = 335.00;
const ELECTRICIAN_RATE_DAY = 440.00;
const PLUMBER_RATE_DAY = 440.00;
const CARPENTER_RATE_DAY = 500.00;


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = parseFloat(element.value);

    return isNaN(value) ? 0 : value;
}


function getText(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value || "";
}


function money(value) {

    return "₹" + Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function quantity(value, decimals = 2) {

    return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


// ============================================================
// FOUNDATION FIELD DISPLAY
// ============================================================

function showFoundationFields() {

    const foundationType =
        document.getElementById("foundationType");

    const stripFields =
        document.getElementById("stripFields");

    const isolatedFields =
        document.getElementById("isolatedFields");

    if (!foundationType) {
        return;
    }

    if (foundationType.value === "isolated") {

        if (stripFields) {
            stripFields.classList.add("hidden");
        }

        if (isolatedFields) {
            isolatedFields.classList.remove("hidden");
        }

    } else {

        if (stripFields) {
            stripFields.classList.remove("hidden");
        }

        if (isolatedFields) {
            isolatedFields.classList.add("hidden");
        }
    }
}


// ============================================================
// RESET FORM
// ============================================================

function resetForm() {

    const form = document.querySelector("form");

    if (form) {
        form.reset();
    }

    const floors = document.getElementById("floors");

    if (floors) {
        floors.value = 1;
    }

    const columns = document.getElementById("columns");

    if (columns) {
        columns.value = 0;
    }

    const footingCount =
        document.getElementById("footingCount");

    if (footingCount) {
        footingCount.value = 0;
    }

    const waterCharges =
        document.getElementById("waterCharges");

    if (waterCharges) {
        waterCharges.value = 1;
    }

    const resultSection =
        document.getElementById("resultSection");

    if (resultSection) {

        resultSection.classList.add("hidden");

        resultSection.innerHTML = "";
    }

    showFoundationFields();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================================
// MAIN CALCULATION
// ============================================================

function calculateEstimate() {

    // ========================================================
    // PROJECT DETAILS
    // ========================================================

    const length = getNumber("length");
    const breadth = getNumber("breadth");
    const floors = getNumber("floors");
    const floorHeight = getNumber("floorHeight");

    if (
        length <= 0 ||
        breadth <= 0 ||
        floors <= 0 ||
        floorHeight <= 0
    ) {

        alert(
            "Please enter valid building dimensions."
        );

        return;
    }


    const areaPerFloor =
        length * breadth;

    const totalBuiltUpArea =
        areaPerFloor * floors;


    // ========================================================
    // WALL DETAILS
    // ========================================================

    const externalWallThickness =
        getNumber("externalWall");

    const internalWallLength =
        getNumber("internalWallLength");

    const internalWallThickness =
        getNumber("internalWall");

    const openingAreaPerFloor =
        getNumber("openingArea");


    const externalWallLength =
        2 * (length + breadth);


    // External wall volume

    const externalWallVolumeFt3 =
        externalWallLength *
        floorHeight *
        externalWallThickness;


    // Internal partition wall volume

    const internalWallVolumeFt3 =
        internalWallLength *
        floorHeight *
        internalWallThickness;


    // Door + window opening volume

    const openingVolumeFt3 =
        openingAreaPerFloor *
        externalWallThickness;


    // Total brickwork per floor

    let brickworkPerFloorFt3 =
        externalWallVolumeFt3 +
        internalWallVolumeFt3 -
        openingVolumeFt3;


    if (brickworkPerFloorFt3 < 0) {
        brickworkPerFloorFt3 = 0;
    }


    // Total brickwork

    const totalBrickworkM3 =
        brickworkPerFloorFt3 *
        floors *
        FT3_TO_M3;


    // ========================================================
    // BRICKS
    // ========================================================

    const BRICKS_PER_M3 = 500;

    const bricksRequired =
        totalBrickworkM3 *
        BRICKS_PER_M3;

    const brickCost =
        (bricksRequired / 1000) *
        BRICK_RATE_1000;


    // ========================================================
    // MORTAR
    // ========================================================

    const mortarValue =
        getText("mortarRatio");

    let cementParts = 1;
    let sandParts = 6;


    if (
        mortarValue.includes("1 : 5") ||
        mortarValue.includes("1:5")
    ) {

        cementParts = 1;
        sandParts = 5;

    } else if (
        mortarValue.includes("1 : 4") ||
        mortarValue.includes("1:4")
    ) {

        cementParts = 1;
        sandParts = 4;
    }


    const MORTAR_RATIO_OF_MASONRY = 0.30;

    const DRY_MORTAR_FACTOR = 1.33;

    const CEMENT_BAG_VOLUME_M3 = 0.0347;


    const mortarWetM3 =
        totalBrickworkM3 *
        MORTAR_RATIO_OF_MASONRY;


    const dryMortarM3 =
        mortarWetM3 *
        DRY_MORTAR_FACTOR;


    const totalParts =
        cementParts +
        sandParts;


    const cementVolumeM3 =
        dryMortarM3 *
        cementParts /
        totalParts;


    const sandVolumeM3 =
        dryMortarM3 *
        sandParts /
        totalParts;


    const cementBags =
        cementVolumeM3 /
        CEMENT_BAG_VOLUME_M3;


    const cementCost =
        cementBags *
        CEMENT_RATE_BAG;


    const sandCost =
        sandVolumeM3 *
        FINE_SAND_RATE_M3;


    // ========================================================
    // RCC WORK
    // ========================================================

    const slabThickness =
        getNumber("slabThickness");


    // Slab

    const slabM3 =
        areaPerFloor *
        slabThickness *
        floors *
        FT3_TO_M3;


    // Columns

    const numberOfColumns =
        getNumber("columns");

    const columnLength =
        getNumber("columnLength");

    const columnBreadth =
        getNumber("columnBreadth");


    const columnM3 =
        numberOfColumns *
        columnLength *
        columnBreadth *
        floorHeight *
        floors *
        FT3_TO_M3;


    // Beams

    const beamLengthPerFloor =
        getNumber("beamLength");

    const beamWidth =
        getNumber("beamWidth");

    const beamDepth =
        getNumber("beamDepth");


    const beamM3 =
        beamLengthPerFloor *
        beamWidth *
        beamDepth *
        floors *
        FT3_TO_M3;


    // Total RCC

    const totalRCCM3 =
        slabM3 +
        columnM3 +
        beamM3;


    const rccCost =
        totalRCCM3 *
        RCC_RATE_M3;


    // ========================================================
    // COARSE AGGREGATE
    // ========================================================
    // Quantity only.
    // Cost already included in composite RCC rate.
    // ========================================================

    const RCC_DRY_VOLUME_FACTOR = 1.54;

    const RCC_AGGREGATE_PART = 4;

    const RCC_TOTAL_PARTS = 7;


    const coarseAggregateM3 =
        totalRCCM3 *
        RCC_DRY_VOLUME_FACTOR *
        (RCC_AGGREGATE_PART / RCC_TOTAL_PARTS);


    // ========================================================
    // FOUNDATION
    // ========================================================

    let footingM3 = 0;

    let footingCost = 0;


    const foundationType =
        getText("foundationType");


    // --------------------------------------------------------
    // ISOLATED FOOTING
    // --------------------------------------------------------

    if (foundationType === "isolated") {

        const numberOfFootings =
            getNumber("footingCount");

        const footingLength =
            getNumber("footingLength");

        const footingBreadth =
            getNumber("footingBreadth");

        const footingDepth =
            getNumber("footingDepth");


        footingM3 =
            numberOfFootings *
            footingLength *
            footingBreadth *
            footingDepth *
            FT3_TO_M3;


        footingCost =
            footingM3 *
            FOOTING_RATE_M3;
    }


    // --------------------------------------------------------
    // STRIP / CONTINUOUS FOOTING
    // --------------------------------------------------------

    else {

        const stripRun =
            getNumber("stripRun");

        const stripBreadth =
            getNumber("stripBreadth");

        const stripDepth =
            getNumber("stripDepth");


        if (
            stripRun > 0 &&
            stripBreadth > 0 &&
            stripDepth > 0
        ) {

            footingM3 =
                stripRun *
                stripBreadth *
                stripDepth *
                FT3_TO_M3;


            // Composite PCC / footing reference rate

            footingCost =
                footingM3 *
                3950.00;
        }
    }


    // ========================================================
    // STEEL
    // ========================================================

    const steelKg =
        getNumber("steelQuantity");

    const steelRate =
        getNumber("steelRate");


    const steelCost =
        steelKg *
        steelRate;


    // ========================================================
    // PLASTER
    // ========================================================

    const plasterHeight =
        getNumber("plasterHeight");


    const externalPlasterFt2 =
        externalWallLength *
        plasterHeight;


    const internalPlasterFt2 =
        internalWallLength *
        plasterHeight *
        2;


    let plasterFt2PerFloor =
        externalPlasterFt2 +
        internalPlasterFt2 -
        openingAreaPerFloor;


    if (plasterFt2PerFloor < 0) {
        plasterFt2PerFloor = 0;
    }


    const plasterM2 =
        plasterFt2PerFloor *
        floors *
        FT2_TO_M2;


    const plasterCost =
        plasterM2 *
        PLASTER_RATE_M2;


    // ========================================================
    // FLOORING
    // ========================================================

    const flooringM2 =
        totalBuiltUpArea *
        FT2_TO_M2;


    const flooringCost =
        flooringM2 *
        FLOORING_RATE_M2;


    // ========================================================
    // PAINTING
    // ========================================================

    const paintingM2 =
        plasterM2;


    const paintingCost =
        paintingM2 *
        PAINTING_RATE_M2;


    // ========================================================
    // LABOUR & SITE DETAILS
    // ========================================================

    const constructionDays =
        getNumber("constructionDays");

    const masons =
        getNumber("masons");

    const mazdoors =
        getNumber("mazdoors");

    const electricianDays =
        getNumber("electricianDays");

    const plumberDays =
        getNumber("plumberDays");

    const carpenters =
        getNumber("carpenters");

    const carpenterDays =
        getNumber("carpenterDays");

    const securityPersonnel =
        getNumber("security");

    const securityDays =
        getNumber("securityDays");

    const securityRate =
        getNumber("securityRate");


    // Mason

    const masonCost =
        masons *
        MASON_RATE_DAY *
        constructionDays;


    // Mazdoor

    const mazdoorCost =
        mazdoors *
        MAZDOOR_RATE_DAY *
        constructionDays;


    // Electrician

    const electricalCost =
        electricianDays *
        ELECTRICIAN_RATE_DAY;


    // Plumber

    const plumbingCost =
        plumberDays *
        PLUMBER_RATE_DAY;


    // Carpenter

    const carpenterCost =
        carpenters *
        CARPENTER_RATE_DAY *
        carpenterDays;


    // Security

    const securityCost =
        securityPersonnel *
        securityRate *
        securityDays;


    // Core labour

    const totalLabourCost =
        masonCost +
        mazdoorCost +
        electricalCost +
        plumbingCost;


    // ========================================================
    // TOTAL MATERIAL COST
    // ========================================================

    const totalMaterialCost =
        brickCost +
        cementCost +
        sandCost +
        rccCost +
        steelCost;


    // ========================================================
    // DIRECT SUBTOTAL
    // ========================================================

    const subtotal =
        totalMaterialCost +
        totalLabourCost +
        carpenterCost +
        securityCost +
        plasterCost +
        flooringCost +
        paintingCost +
        footingCost;


    // ========================================================
    // WATER CHARGES
    // ========================================================

    const waterChargePercent =
        getNumber("waterCharges");


    const waterChargesCost =
        subtotal *
        (waterChargePercent / 100);


    const subtotalWithWater =
        subtotal +
        waterChargesCost;


    // ========================================================
    // CONTINGENCY
    // ========================================================

    const contingency =
        subtotalWithWater *
        0.05;


    // ========================================================
    // GRAND TOTAL
    // ========================================================

    const grandTotal =
        subtotalWithWater +
        contingency;


    // ========================================================
    // RESULT SECTION
    // ========================================================

    const resultSection =
        document.getElementById("resultSection");


    if (!resultSection) {

        alert(
            "Result section not found in HTML."
        );

        return;
    }


    resultSection.classList.remove("hidden");


    const months =
        constructionDays / 30;


    // ========================================================
    // ONE UNIFIED RESULT BOX
    // ========================================================

    resultSection.innerHTML = `

        <div style="
            padding:24px;
            border:1px solid #dfe4ea;
            border-radius:14px;
            background:#ffffff;
        ">

            <h2 style="
                margin:0 0 20px 0;
                color:#17365D;
            ">
                Estimation Result
            </h2>


            <!-- PROJECT DETAILS -->

            <div style="
                margin-bottom:24px;
                padding:18px;
                border-radius:10px;
                background:#f7f9fc;
                border:1px solid #e3e7ec;
            ">

                <h3 style="
                    margin-top:0;
                    color:#17365D;
                ">
                    Project Details
                </h3>


                <p>
                    <b>Building Length:</b>
                    ${quantity(length)} ft
                </p>


                <p>
                    <b>Building Breadth:</b>
                    ${quantity(breadth)} ft
                </p>


                <p>
                    <b>Area per Floor:</b>
                    ${quantity(areaPerFloor)} sq.ft
                </p>


                <p>
                    <b>Number of Floors:</b>
                    ${quantity(floors, 0)}
                </p>


                <p>
                    <b>Total Built-up Area:</b>
                    ${quantity(totalBuiltUpArea)} sq.ft
                </p>


                <p>
                    <b>Floor Height:</b>
                    ${quantity(floorHeight)} ft
                </p>


                <p>
                    <b>Construction Duration:</b>
                    ${quantity(constructionDays, 0)}
                    days
                    (${months.toFixed(2)} months)
                </p>


                <p>
                    <b>Foundation Type:</b>
                    ${
                        foundationType === "isolated"
                        ? "Isolated Footing"
                        : "Strip / Continuous Footing"
                    }
                </p>


                <p>
                    <b>Mortar Ratio:</b>
                    ${mortarValue || "1 : 6"}
                </p>

            </div>


            <!-- CONSTRUCTION QUANTITIES -->

            <div style="
                margin-bottom:24px;
                padding:18px;
                border-radius:10px;
                background:#f7f9fc;
                border:1px solid #e3e7ec;
            ">

                <h3 style="
                    margin-top:0;
                    color:#17365D;
                ">
                    Construction Quantities
                </h3>


                <p>
                    <b>Brickwork:</b>
                    ${quantity(totalBrickworkM3)} m³
                </p>


                <p>
                    <b>Bricks:</b>
                    ${quantity(bricksRequired)} Nos.
                </p>


                <p>
                    <b>Cement:</b>
                    ${quantity(cementBags)} bags
                </p>


                <p>
                    <b>Fine Sand:</b>
                    ${quantity(sandVolumeM3)} m³
                </p>


                <p>
                    <b>RCC:</b>
                    ${quantity(totalRCCM3)} m³
                </p>


                <p>
                    <b>Coarse Aggregate:</b>
                    ${quantity(coarseAggregateM3)} m³

                    <br>

                    <small>
                        Quantity only — aggregate cost is already
                        included in the composite RCC rate.
                    </small>
                </p>


                <p>
                    <b>Foundation Concrete:</b>
                    ${quantity(footingM3)} m³
                </p>


                <p>
                    <b>Steel:</b>
                    ${quantity(steelKg)} kg
                </p>


                <p>
                    <b>Plaster:</b>
                    ${quantity(plasterM2)} m²
                </p>


                <p>
                    <b>Flooring:</b>
                    ${quantity(flooringM2)} m²
                </p>


                <p>
                    <b>Painting:</b>
                    ${quantity(paintingM2)} m²
                </p>

            </div>


            <!-- LABOUR DETAILS -->

            <div style="
                margin-bottom:24px;
                padding:18px;
                border-radius:10px;
                background:#f7f9fc;
                border:1px solid #e3e7ec;
            ">

                <h3 style="
                    margin-top:0;
                    color:#17365D;
                ">
                    Labour & Site Details
                </h3>


                <p>
                    <b>Masons:</b>
                    ${quantity(masons, 0)}
                </p>


                <p>
                    <b>Mazdoors:</b>
                    ${quantity(mazdoors, 0)}
                </p>


                <p>
                    <b>Electrician Workdays:</b>
                    ${quantity(electricianDays, 0)}
                </p>


                <p>
                    <b>Plumber Workdays:</b>
                    ${quantity(plumberDays, 0)}
                </p>


                <p>
                    <b>Carpenters:</b>
                    ${quantity(carpenters, 0)}
                </p>


                <p>
                    <b>Carpenter Days:</b>
                    ${quantity(carpenterDays, 0)}
                </p>


                <p>
                    <b>Security Personnel:</b>
                    ${quantity(securityPersonnel, 0)}
                </p>


                <p>
                    <b>Security Days:</b>
                    ${quantity(securityDays, 0)}
                </p>

            </div>


            <!-- COST SUMMARY -->

            <div style="
                margin-bottom:24px;
                padding:18px;
                border-radius:10px;
                background:#f7f9fc;
                border:1px solid #e3e7ec;
            ">

                <h3 style="
                    margin-top:0;
                    color:#17365D;
                ">
                    Cost Summary
                </h3>


                <p>
                    <b>Foundation:</b>
                    ${money(footingCost)}
                </p>


                <p>
                    <b>RCC Work:</b>
                    ${money(rccCost)}
                </p>


                <p>
                    <b>Brickwork:</b>
                    ${money(brickCost)}
                </p>


                <p>
                    <b>Cement:</b>
                    ${money(cementCost)}
                </p>


                <p>
                    <b>Fine Sand:</b>
                    ${money(sandCost)}
                </p>


                <p>
                    <b>Steel:</b>
                    ${money(steelCost)}
                </p>


                <p>
                    <b>Core Labour:</b>
                    ${money(totalLabourCost)}
                </p>


                <p>
                    <b>Carpenter:</b>
                    ${money(carpenterCost)}
                </p>


                <p>
                    <b>Site Security:</b>
                    ${money(securityCost)}
                </p>


                <p>
                    <b>Total Labour:</b>
                    ${money(
                        totalLabourCost +
                        carpenterCost +
                        securityCost
                    )}
                </p>


                <p>
                    <b>
                        Water Charges
                        (${quantity(waterChargePercent, 0)}%):
                    </b>

                    ${money(waterChargesCost)}
                </p>


                <p>
                    <b>Plaster:</b>
                    ${money(plasterCost)}
                </p>


                <p>
                    <b>Flooring:</b>
                    ${money(flooringCost)}
                </p>


                <p>
                    <b>Painting:</b>
                    ${money(paintingCost)}
                </p>


                <hr style="
                    border:0;
                    border-top:1px solid #d5dbe2;
                ">


                <p style="font-size:18px;">

                    <b>Subtotal:</b>

                    ${money(subtotalWithWater)}

                </p>


                <p style="font-size:18px;">

                    <b>Contingency (5%):</b>

                    ${money(contingency)}

                </p>


                <!-- GRAND TOTAL -->

                <div style="
                    margin-top:18px;
                    padding:16px;
                    border-radius:10px;
                    background:#17365D;
                    color:white;
                    text-align:center;
                ">

                    <div style="
                        font-size:14px;
                        letter-spacing:0.5px;
                    ">
                        GRAND TOTAL
                    </div>


                    <div style="
                        font-size:28px;
                        font-weight:bold;
                        margin-top:5px;
                    ">
                        ${money(grandTotal)}
                    </div>

                </div>

            </div>


            <!-- IMPORTANT NOTE -->

            <div style="
                padding:16px;
                border-radius:10px;
                background:#fff8e8;
                border:1px solid #f0dfad;
            ">

                <b>Important Note:</b>

                This is a preliminary estimate.
                Quantities and structural requirements should be
                verified through approved drawings, structural design
                and BOQ before construction.

            </div>


            <!-- PRINT BUTTON -->

            <div class="report-buttons"
                style="
                    margin-top:20px;
                    text-align:center;
                ">

                <button
                    type="button"
                    onclick="generateReport()"
                    style="
                        padding:12px 22px;
                        border:none;
                        border-radius:8px;
                        background:#17365D;
                        color:white;
                        font-size:15px;
                        cursor:pointer;
                    "
                >
                    Print / Save PDF
                </button>

            </div>

        </div>
    `;


    // ========================================================
    // UPDATE LEGACY ELEMENTS IF PRESENT
    // ========================================================

    const outputMap = {

        foundationCost:
            footingCost,

        rccCost:
            rccCost,

        brickCost:
            brickCost,

        plasterCost:
            plasterCost,

        floorCost:
            flooringCost,

        paintingCost:
            paintingCost,

        steelCost:
            steelCost,

        labourCost:
            totalLabourCost +
            carpenterCost +
            securityCost
    };


    Object.keys(outputMap).forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                money(outputMap[id]);
        }
    });


    // ========================================================
    // STORE LATEST ESTIMATE
    // ========================================================

    window.latestEstimate = {

        length,
        breadth,
        floors,
        floorHeight,

        areaPerFloor,
        totalBuiltUpArea,

        totalBrickworkM3,
        bricksRequired,

        cementBags,
        sandVolumeM3,

        totalRCCM3,
        coarseAggregateM3,

        footingM3,
        steelKg,

        plasterM2,
        flooringM2,
        paintingM2,

        brickCost,
        cementCost,
        sandCost,
        rccCost,
        steelCost,

        footingCost,

        totalLabourCost,
        carpenterCost,
        securityCost,

        waterChargesCost,

        plasterCost,
        flooringCost,
        paintingCost,

        subtotal: subtotalWithWater,

        contingency,

        grandTotal
    };


    // ========================================================
    // CONSOLE CHECK
    // ========================================================

    console.log(
        "================================="
    );

    console.log(
        "SMART CONSTRUCTION ESTIMATION"
    );

    console.log(
        "================================="
    );

    console.log(
        "Area:",
        areaPerFloor
    );

    console.log(
        "Total Built-up Area:",
        totalBuiltUpArea
    );

    console.log(
        "Brickwork:",
        totalBrickworkM3
    );

    console.log(
        "Bricks:",
        bricksRequired
    );

    console.log(
        "Cement:",
        cementBags
    );

    console.log(
        "Sand:",
        sandVolumeM3
    );

    console.log(
        "RCC:",
        totalRCCM3
    );

    console.log(
        "Aggregate:",
        coarseAggregateM3
    );

    console.log(
        "Foundation:",
        footingM3
    );

    console.log(
        "Steel:",
        steelKg
    );

    console.log(
        "Core Labour:",
        totalLabourCost
    );

    console.log(
        "Carpenter:",
        carpenterCost
    );

    console.log(
        "Security:",
        securityCost
    );

    console.log(
        "Water Charges:",
        waterChargesCost
    );

    console.log(
        "Subtotal:",
        subtotalWithWater
    );

    console.log(
        "Contingency:",
        contingency
    );

    console.log(
        "Grand Total:",
        grandTotal
    );


    // ========================================================
    // SCROLL TO RESULT
    // ========================================================

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ============================================================
// GENERATE REPORT / PRINT / SAVE PDF
// ============================================================
// IMPORTANT:
// Old version used a blank popup in some browsers.
// This version creates the complete report document first,
// then prints it after the page is fully loaded.
// ============================================================

function generateReport() {

    const result =
        document.getElementById("resultSection");


    // --------------------------------------------------------
    // CHECK WHETHER ESTIMATE EXISTS
    // --------------------------------------------------------

    if (
        !result ||
        result.classList.contains("hidden") ||
        result.innerHTML.trim() === ""
    ) {

        alert(
            "Please calculate the estimate first."
        );

        return;
    }


    // --------------------------------------------------------
    // OPEN REPORT WINDOW
    // --------------------------------------------------------

    const reportWindow =
        window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


    if (!reportWindow) {

        alert(
            "Please allow pop-ups for the report."
        );

        return;
    }


    // --------------------------------------------------------
    // CLONE RESULT
    // --------------------------------------------------------
    // We clone the result instead of directly moving it.
    // Therefore original website remains unchanged.
    // --------------------------------------------------------

    const reportClone =
        result.cloneNode(true);


    // Remove buttons from PDF report

    reportClone
        .querySelectorAll(
            "button, .report-buttons"
        )
        .forEach(element => {

            element.remove();

        });


    // --------------------------------------------------------
    // COMPLETE REPORT HTML
    // --------------------------------------------------------

    const reportHTML = `

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Construction Estimation Report
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        body {

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            margin: 0;

            padding: 30px;

            background: white;

            color: #222;

            line-height: 1.6;
        }


        .report-header {

            border-bottom:
                3px solid #17365D;

            padding-bottom: 15px;

            margin-bottom: 25px;
        }


        .report-header h1 {

            margin:
                0 0 5px 0;

            color: #17365D;

            font-size: 26px;
        }


        .report-header p {

            margin:
                3px 0;

            color: #555;
        }


        .report-wrapper {

            width: 100%;
        }


        h2,
        h3 {

            color: #17365D;
        }


        p {

            margin:
                7px 0;
        }


        hr {

            border: 0;

            border-top:
                1px solid #d5dbe2;
        }


        small {

            color: #666;
        }


        @page {

            size: A4;

            margin: 15mm;
        }


        @media print {

            body {

                padding: 0;

                margin: 0;

                background: white;
            }


            .report-header {

                margin-top: 0;
            }


            .report-wrapper {

                width: 100%;
            }


            div {

                break-inside: avoid;
            }

        }


    </style>

</head>


<body>


    <div class="report-wrapper">


        <div class="report-header">

            <h1>
                SMART CONSTRUCTION ESTIMATION SYSTEM
            </h1>

            <p>
                C++ / Web Based Construction Cost Estimation
            </p>

            <p>
                PWD / SOR Based Preliminary Estimate
            </p>

        </div>


        ${reportClone.outerHTML}


    </div>


</body>

</html>
`;


    // --------------------------------------------------------
    // WRITE REPORT
    // --------------------------------------------------------

    reportWindow.document.open();

    reportWindow.document.write(
        reportHTML
    );

    reportWindow.document.close();


    // --------------------------------------------------------
    // PRINT AFTER DOCUMENT LOAD
    // --------------------------------------------------------

    reportWindow.onload = function () {

        setTimeout(function () {

            reportWindow.focus();

            reportWindow.print();

        }, 700);

    };


    // --------------------------------------------------------
    // FALLBACK FOR BROWSERS WHERE ONLOAD FIRES EARLY
    // --------------------------------------------------------

    setTimeout(function () {

        try {

            if (
                reportWindow &&
                !reportWindow.closed
            ) {

                reportWindow.focus();

                reportWindow.print();

            }

        } catch (error) {

            console.log(
                "Print fallback:",
                error
            );

        }

    }, 1500);
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showFoundationFields();

    }
);


// ============================================================
// FOUNDATION TYPE CHANGE
// ============================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target &&
            event.target.id === "foundationType"
        ) {

            showFoundationFields();

        }

    }
);