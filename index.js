const colors = {
  ground: "#111",
  // gradient sky color maybe? https://www.w3schools.com/tags/canvas_fillstyle.asp
  nightSky: ["#0c1445", "#090622"],
  moon: "#ccc",
  stars: "#eee",
  buildings: ["#111", "#181818", "#222"],
  windows: ["#eee", "#eecccc"],
  spires: ["#eee", "#eecccc"],
};

let canvas;
let ctx;
let horizon;
let avgBuildingWidth;
let avgBuildingHeight;
let buildingWidthVariation;
let buildingHeightVariation;
let chanceToSkipBuilding;
let chanceToOverlapBuilding;
let avgBuildingOverlap;
let buildingOverlapVariation;
let windowWidth;
let windowHeight;
let spaceBetweenWindows;
let chanceWindowsAreLitUp;

function generateSkyline() {
  setupCanvas();
  setupBuildingSizes();
  drawSky();
  drawGround();
  drawBuildings();
  // drawBuilding(373, 38, 156);
}

function setupCanvas() {
  canvas = document.getElementById("landscapeCanvas");
  canvas.width = 800;
  canvas.height = 500;
  ctx = canvas.getContext("2d");
}

function setupBuildingSizes() {
  avgBuildingHeight = randomInt(60, 150);
  avgBuildingWidth = Math.max(randomInt(20, 40), avgBuildingHeight / 10);
  buildingWidthVariation = randomInt(5, 9);
  buildingHeightVariation = randomInt(60, 120);
  chanceToSkipBuilding = randomInt(0, 35);
  chanceToOverlapBuilding = randomInt(0, 50);
  avgBuildingOverlap = randomInt(3, 12);
  buildingOverlapVariation = randomInt(1, 5);
  windowWidth = avgBuildingWidth / 10;
  windowHeight = Math.max(avgBuildingHeight / 22, windowWidth);
  spaceBetweenWindows = randomInt(2, 6);
  chanceWindowsAreLitUp = randomInt(15, 75);
}

function drawSky() {
  horizon = randomInt(300, 400);
  drawRect(
    ctx,
    0,
    0,
    canvas.width,
    horizon,
    randomSelectionFromArray(colors.nightSky)
  );
  drawMoon();
  drawStars();
}

function drawMoon() {
  const position = {
    x: randomInt(0, canvas.width),
    y: randomInt(0, horizon - 50),
  };
  const radius = randomInt(20, 40);
  drawDot(ctx, position.x, position.y, radius, colors.moon);
}

function drawStars() {
  const numStars = randomInt(0, 100);
  for (let i = 0; i < numStars; i++) {
    drawStar();
  }
}

function drawStar() {
  const position = {
    x: randomInt(0, canvas.width),
    y: randomInt(0, horizon - 5),
  };
  const radius = Math.random();
  drawDot(ctx, position.x, position.y, radius, colors.stars);
}

function drawGround() {
  drawRect(
    ctx,
    0,
    horizon,
    canvas.width,
    canvas.height - horizon,
    colors.ground
  );
}

function drawBuildings() {
  let startPosition = 0;
  while (startPosition < canvas.width) {
    let buildingWidth = randomInt(
      avgBuildingWidth - buildingWidthVariation,
      avgBuildingWidth + buildingWidthVariation
    );
    let buildingHeight = randomInt(
      avgBuildingHeight - buildingHeightVariation,
      avgBuildingHeight + buildingHeightVariation
    );
    if (buildingHeight < 60) {
      buildingHeight = randomInt(40, 60);
    }

    const maxWidthToHeightRatioForStructuralIntegrity = 10;
    if (
      buildingHeight / buildingWidth >
      maxWidthToHeightRatioForStructuralIntegrity
    ) {
      buildingWidth =
        buildingHeight / maxWidthToHeightRatioForStructuralIntegrity;
    }

    const includeBuildingOverlap = randomInt(0, 100) <= chanceToOverlapBuilding;
    const buildingOverlap = randomInt(
      avgBuildingOverlap - buildingOverlapVariation,
      avgBuildingOverlap + buildingOverlapVariation
    );
    if (includeBuildingOverlap) {
      startPosition -= buildingOverlap;
    }

    const skipBuilding = randomInt(0, 100) <= chanceToSkipBuilding;
    if (!skipBuilding) {
      drawBuilding(startPosition, buildingWidth, buildingHeight);
    }

    startPosition += buildingWidth;
  }
}

function drawBuilding(x, width, height) {
  const color = randomSelectionFromArray(colors.buildings);
  const y = horizon - height;
  drawRect(ctx, x, y, width, height, color);
  drawWindows({ x, y, width, height });

  // a small percentage of the taller buildings will have spires
  const hasSpire = Math.random() < 0.2 && height > avgBuildingHeight;
  if (hasSpire) {
    drawSpire({ x, y, width, height });
  }
}

function drawWindows(buildingPosition) {
  // windows for a particular building will all be the same color
  const windowColor = randomSelectionFromArray(colors.windows);
  const windowsPerRow = Math.floor(
    (buildingPosition.width - spaceBetweenWindows) /
      (windowWidth + spaceBetweenWindows)
  );
  const windowsPerColumn = Math.floor(
    (buildingPosition.height - spaceBetweenWindows) /
      (windowHeight + spaceBetweenWindows)
  );

  // Each building requires custom spacing between windows to make sure they end up symmetrical
  const darkSpaceOnBuildingWidth =
    buildingPosition.width - windowsPerRow * windowWidth;
  const darkSpaceOnBuildingHeight =
    buildingPosition.height - windowsPerColumn * windowHeight;
  const spaceBetweenWindowsOnRow =
    darkSpaceOnBuildingWidth / (windowsPerRow + 1);
  const spaceBetweenWindowsOnColumn =
    darkSpaceOnBuildingHeight / (windowsPerColumn + 1);

  for (let i = 0; i < windowsPerRow; i++) {
    for (let j = 0; j < windowsPerColumn; j++) {
      const windowIsLitUp = randomInt(0, 100) <= chanceWindowsAreLitUp;
      if (!windowIsLitUp) {
        continue;
      }

      const x =
        buildingPosition.x +
        i * (windowWidth + spaceBetweenWindowsOnRow) +
        spaceBetweenWindowsOnRow;
      const y =
        buildingPosition.y +
        j * (windowHeight + spaceBetweenWindowsOnColumn) +
        spaceBetweenWindowsOnColumn;

      drawRect(ctx, x, y, windowWidth, windowHeight, windowColor);
    }
  }
}

function drawSpire(buildingPosition) {
  const spireHeight = buildingPosition.height / randomInt(4, 6);
  const spireWidth = buildingPosition.width / 15;
  const spireColor = randomSelectionFromArray(colors.spires);
  const spireX = buildingPosition.x + buildingPosition.width / 2;
  const spireY = buildingPosition.y - spireHeight;
  drawRect(ctx, spireX, spireY, spireWidth, spireHeight, spireColor);
}

generateSkyline();
