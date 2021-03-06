import * as pd from 'pandas';
import * as fig from 'matplotlib/pyplot';
import * as np from 'numpy';
import {mplot3d} from 'mpl_toolkits';
import {griddata as gd} from 'scipy/interpolate';
import * as ndimage from 'scipy/ndimage';
import {cm} from 'matplotlib';
import * as time from 'time';
import {Image} from 'PIL';
var X, Y, Z, Z2, ax, df, images, sup, x, y;
fig.figure();
fig.style.use("ggplot");
ax = fig.subplot(111, {"projection": "3d"});
ax.set_xlim3d(0, 70);
ax.set_ylim3d(0, 5000);
ax.set_zlim3d(0, 6);
ax.text(70, 100, 1, "SP", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 3800, 1, "AM", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 400, 1, "RJ", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 500, 1, "PR", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 1900, 1, "BA", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 1000, 1, "DF", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 3000, 1, "CE", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 4600, 1, "RR", {"color": "black", "fontsize": 10, "weight": "bold"});
ax.text(70, 3500, 1, "AC", {"color": "black", "fontsize": 10, "weight": "bold"});
images = [];
for (var i = 2, _pj_a = 60; (i < _pj_a); i += 1) {
    df = pd.read_excel("Covide_Dist_NAOcum_Brasil.xlsx", {"sheet_name": "CasosBruto", "nrows": i});
    df.slice(0) = np.where((df.slice(0) > 0), np.log(df.slice(0)), df.slice(0));
    df = df.reindex(sorted(df.columns), {"axis": 1});
    y = df.columns;
    x = df.index;
    [Y, X] = np.meshgrid(y, x);
    Z = df.interpolate({"method": "nearest", "limit_direction": "forward"});
    Z2 = ndimage.gaussian_filter(Z, {"sigma": 1.0, "order": 0});
    sup = ax.contour3D(X, Y, Z2, 100, {"cmap": "Spectral"});
    ax.xaxis.label.set_color("black");
    ax.yaxis.label.set_color("black");
    ax.zaxis.label.set_color("black");
    ax.tick_params({"axis": "x", "colors": "black"});
    ax.tick_params({"axis": "y", "colors": "black"});
    ax.tick_params({"axis": "z", "colors": "black"});
    ax.xaxis.pane.fill = false;
    ax.yaxis.pane.fill = false;
    ax.zaxis.pane.fill = false;
    ax.set_xlabel("dias", {"fontsize": 16});
    ax.set_ylabel("dist\u00e2ncia (km)", {"fontsize": 16});
    ax.view_init(62, 22);
    fig.pause(0.01);
    fig.savefig("corona {0}.jpg".format(i));
    images.append(Image.open("corona {0}.jpg".format(i)));
}
images[0].save("animacao_corona.gif", {"format": "GIF", "append_images": images.slice(1), "save_all": true, "duration": 60, "loop": 0});

//# sourceMappingURL=Curva_Nivel_Nao_Cumulada_CAMERA_BRASIL.js.map
