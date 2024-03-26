// fragment.glsl
uniform vec3 uColor;
varying vec2 vUv;
varying float opacity;

void main()
{
  gl_FragColor = vec4(uColor, opacity);
}