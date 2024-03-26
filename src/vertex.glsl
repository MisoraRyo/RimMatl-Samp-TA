//vertex.glsl
uniform vec3 viewVector;// CameraPosition
varying vec2 vUv;
varying float opacity;

void main() {
  vUv = uv;

  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec4 mvPosition =  viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;
  //
  vec3 nNomal = normalize(normal);
  vec3 nViewVec = normalize(viewVector);
  opacity = dot(nNomal, nViewVec);
  opacity = 1.0 - abs(opacity*1.3);
}