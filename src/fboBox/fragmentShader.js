const fragmentShader = `
uniform sampler2D tex;
varying vec2 vPosColor;

void main() {
  // vec3 color = vec3(0.34, 0.53, 0.96);
  // gl_FragColor = vec4(color, 1.0);

  vec4 mapTexel = texture2D( tex, vPosColor );

  // vec3 color = vec3(0.34, 0.53, 0.96);
  // gl_FragColor = vec4(color, 1.0);

  vec3 outgoingLight = vec3( 0.0 );
  vec3 color = mapTexel.rgb;
  outgoingLight = color.rgb;

  // square to circle
  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);
  #ifdef GL_OES_standard_derivatives
    delta = fwidth(r);
    alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
  #endif

  if (r > 1.0) {
    discard;
  }

  gl_FragColor = vec4( outgoingLight, 1.0 ) * alpha;
}
`

export default fragmentShader
