import { Injectable } from '@angular/core';
import { faHeart, faShieldAlt, faBolt, faTachometerAlt, faGavel } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconMap: {[key: string]: IconProp} = {
    'fas fa-heart': faHeart,
    'fas fa-sword': faGavel,
    'fas fa-shield-alt': faShieldAlt,
    'fas fa-bolt': faBolt,
    'fas fa-tachometer-alt': faTachometerAlt
  };

  getIcon(iconName: string): IconProp {
    return this.iconMap[iconName];
  }
}
