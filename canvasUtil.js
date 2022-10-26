function drawLine(ctx, fromX, fromY, toX, toY, color = "black") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

function drawRect(ctx, x, y, width, height, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawCircle(ctx, x, y, radius, color = "black") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawDot(ctx, x, y, radius, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}
